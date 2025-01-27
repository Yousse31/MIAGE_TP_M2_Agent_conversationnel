# services/llm_service.py
"""
Service principal gérant les interactions avec le modèle de langage
Compatible avec les fonctionnalités du TP1 et du TP2
"""
from datetime import datetime
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
import os
from typing import List, Dict, Optional, Any
import uuid

from services.memory import EnhancedMemoryHistory
from services.mongo_services import MongoService
from core.config import settings  
from services.chains import SummaryService
from services.tools import AssistantTools

class LLMService:

    def __init__(self):
        self.mongo_service = MongoService()
        self.llm = ChatOpenAI(api_key=settings.openai_api_key) 
        self.summary_service = SummaryService(self.llm)
        #self.session_manager = SessionManager()
        self.tools = AssistantTools(self.llm)

    async def generate_response(self,
        message: str,
        session_id: str) -> str:
        """Génère une réponse et sauvegarde dans MongoDB"""

        # Récupération de l'historique depuis MongoDB
        history = await self.mongo_service.get_conversation_history(session_id)

        # Conversion de l'historique en messages LangChain
        messages = [SystemMessage(content="Vous êtes un assistant utile et concis.")]
        for msg in history:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                messages.append(AIMessage(content=msg["content"]))

        # Ajout du nouveau message
        messages.append(HumanMessage(content=message))

        # Génération de la réponse
        response = await self.llm.agenerate([messages])
        response_text = response.generations[0][0].text

        # Sauvegarde des messages dans MongoDB
        await self.mongo_service.save_message(session_id, "user", message)
        await self.mongo_service.save_message(session_id, "assistant", response_text)
        return response_text
    
    async def generate_response_with_category(self, message: str, session_id: Optional[str], category_label: str, user_id: str) -> str:
        """Génère une réponse en utilisant un prompt spécifique à une catégorie et les comptes utilisateur"""
        # Générer un nouveau session_id si non fourni
        if not session_id:
            session_id = str(uuid.uuid4())

        # Récupération du prompt de la catégorie
        category_prompt = await self.mongo_service.get_category_prompt(category_label)
        if not category_prompt or "description" not in category_prompt:
            raise ValueError(f"Catégorie '{category_label}' non trouvée ou description manquante")

        # Récupération de l'historique depuis MongoDB
        history = await self.mongo_service.get_conversation_history(session_id)

        # Conversion de l'historique en messages LangChain
        system_message_content = category_prompt["description"]
        messages = [SystemMessage(content=system_message_content)]
        for msg in history:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                messages.append(AIMessage(content=msg["content"]))

        # Ajout du nouveau message
        messages.append(HumanMessage(content=message))

        # Si la catégorie est 'conseil', récupérer les comptes utilisateur
        if category_label == 'conseil':
            user_accounts = await self.mongo_service.get_user_accounts(user_id)
            accounts_summary = "\n".join([
                f"Compte {acc['compte']} ({acc['type']}): {acc['montant']} EUR, ouvert le {acc['date_ouverture']}"
                for acc in user_accounts
            ])
            system_message_content += f"\nVoici les comptes de l'utilisateur:\n{accounts_summary}"

        # Si la catégorie est 'operation', déterminer le montant à partir du LLM
        if category_label == 'operation':
            user_accounts = await self.mongo_service.get_user_accounts(user_id)
            if not user_accounts:
                system_message_content += "\nAucun compte trouvé pour cet utilisateur."
            else:
                accounts_summary = "\n".join([
                    f"Compte {acc['compte']} ({acc['type']}): {acc['montant']} EUR"
                    for acc in user_accounts
                ])
                system_message_content += f"\nVoici les comptes de l'utilisateur:\n{accounts_summary}"
                system_message_content += "\nVeuillez répondre dans le format suivant pour chaque opération : 'Montant: <montant> EUR, Compte: <compte>'"

            # Mise à jour du SystemMessage avec le contenu combiné
            messages[0] = SystemMessage(content=system_message_content)

            # Génération de la réponse pour obtenir les montants et les comptes
            response = await self.llm.agenerate([messages])
            response_text = response.generations[0][0].text

            # Extraction des montants et des comptes de la réponse
            operations = response_text.strip().split('\n')
            for operation in operations:
                try:
                    amount_str, account_str = operation.strip().split(',')
                    amount = float(amount_str.split(':')[1].strip().split()[0])
                    account = account_str.split(':')[1].strip()
                except (ValueError, IndexError):
                    raise ValueError(f"Impossible d'extraire le montant ou le compte de l'opération: {operation}")

                # Vérification que le compte existe
                account_info = next((acc for acc in user_accounts if acc['compte'] == account), None)
                if not account_info:
                    raise ValueError(f"Compte '{account}' non trouvé pour l'utilisateur '{user_id}'. Montant: {amount} EUR, Compte: {account}")

                current_balance = account_info['montant']

                # Vérification que le montant reste positif après l'opération
                if current_balance + amount < 0:
                    raise ValueError(f"Le montant de l'opération ({amount} EUR) sur le compte {account} entraînerait un solde négatif.")

                # Effectuer l'opération bancaire
                success = await self.mongo_service.perform_bank_operation(user_id, account, amount)
                if success:
                    messages.append(SystemMessage(content=f"L'opération de {amount} EUR sur le compte {account} a été effectuée avec succès."))
                else:
                    messages.append(SystemMessage(content=f"Échec de l'opération de {amount} EUR sur le compte {account}."))

        # Si la catégorie est 'investissement', répondre uniquement aux questions liées à l'investissement
        if category_label == 'investissement':
            user_accounts = await self.mongo_service.get_user_accounts(user_id)
            accounts_summary = "\n".join([
                f"Compte {acc['compte']} ({acc['type']}): {acc['montant']} EUR, ouvert le {acc['date_ouverture']}"
                for acc in user_accounts
            ])
            system_message_content += f"\nVoici les comptes de l'utilisateur:\n{accounts_summary}"

        # Génération de la réponse
        response = await self.llm.agenerate([messages])
        response_text = response.generations[0][0].text

        # Sauvegarde des messages dans MongoDB
        await self.mongo_service.save_message(session_id, "user", message)
        await self.mongo_service.save_message(session_id, "assistant", response_text)
        return response_text

    async def get_conversation_history(self, session_id: str) -> List[Dict[str, str]]:
        """Récupère l'historique depuis MongoDB"""
        return await self.mongo_service.get_conversation_history(session_id)

    async def generate_summary(self, text: str) -> Dict[str, Any]:
        return await self.summary_service.generate_summary(text)

    def _get_session_history(self, session_id: str) -> BaseChatMessageHistory:
        """Récupère ou crée l'historique pour une session donnée"""
        if session_id not in self.conversation_store:
            self.conversation_store[session_id] = EnhancedMemoryHistory()
        return self.conversation_store[session_id]
    
    def cleanup_inactive_sessions(self):
        """Nettoie les sessions inactives"""
        current_time = datetime.now()
        for session_id, history in list(self.conversation_store.items()):
            if not history.is_active():
                del self.conversation_store[session_id]

    async def process_with_tools(self, query: str) -> str:
        return await self.tools.process_request(query)