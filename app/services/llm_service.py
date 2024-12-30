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