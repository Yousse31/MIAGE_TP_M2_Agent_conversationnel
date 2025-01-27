# Projet TP MIAGE M2 - Agent Conversationnel secteur bancaire 

## Membres du groupe 
ANSARI Youssef
MANSOURI Neila
POUJOL Noémie

## Explication du projet
Nous avons développé un **agent conversationnel intelligent spécialisé dans le secteur bancaire**.  
L'objectif est de permettre aux utilisateurs d'interagir facilement avec leur banque pour obtenir des informations financières, effectuer des opérations courantes et recevoir des conseils d'investissement.

## Comment lancer le projet 
- **Backend :** 
   Exécuter le fichier main.py

- **Frontend :** 
   cd finance-chatbot-front
   npm install
   ng serve

## Fonctionnalités

### 1. Opération
- Consultation des soldes de comptes (CCP, Livret A, etc.).
- Effectuer des virements internes 

### 2. Investissement


### 3. Conseils
- Répondre aux questions des utilisateurs.
- Donner des conseils pour mieux gérer les dépenses et les revenus.
- Aider à comprendre les concepts financiers de base.


## Technologies utilisées
### **Back-end **
- **Langage:** Python  
- **Framework:** FastAPI  
- **Base de données:** MongoDB (stockage des comptes et transactions utilisateurs)  
- **Librairies IA:** LangChain pour le traitement du langage naturel  

### **Front-end **
- **Langage:** TypeScript  
- **Framework:** Angular  
- **Gestion des requêtes:** HttpClient  
- **UI:** Angular Material pour l'interface utilisateur  


## Structure du Projet (VERSION DU PROF)

```
C:.
├───api/                    # Gestion des routes et endpoints de l'API
│   ├───endpoints/         # Endpoints spécifiques par fonctionnalité
│   │   └───chat.py       # Endpoint pour les fonctionnalités de chat
│   └───router.py         # Router principal regroupant tous les endpoints
├───core/                  # Configuration et éléments centraux de l'application
├───models/               # Modèles de données Pydantic
│   └───chat.py          # Modèles pour les requêtes/réponses de chat
├───services/            # Services métier
│   └───llm_service.py   # Service d'interaction avec le LLM
├───utils/               # Utilitaires et helpers
└───main.py             # Point d'entrée de l'application
```




## Explication des Composants principaux

### 1. Main Application (main.py)
```
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
```
- Point d'entrée de l'application
- Configure FastAPI et les middlewares
- Initialise les routes
### 2. Modèles (models/chat.py)
```
class ChatRequest(BaseModel):
    message: str
```
- Définit la structure des données entrantes/sortantes
- Utilise Pydantic pour la validation des données
- Version simple pour débuter, extensible pour le contexte
### 3. Service LLM (services/llm_service.py)
```
class LLMService:
    def __init__(self):
        self.llm = ChatOpenAI(...)
```
- Gère l'interaction avec le modèle de langage
- Configure le client OpenAI
- Traite les messages et le contexte
### 4. Router API (api/router.py)
```
@router.post("/chat")
async def chat(request: ChatRequest) -> ChatResponse:
```
- Définit les endpoints de l'API
- Gère les requêtes HTTP
- Valide les données entrantes

## Structure de l'API

### Endpoints Disponibles
**/chat/with-category** : Version avancée avec gestion de la catégorie
**/history/{session_id}** : Récupération de l'historique d'une conversation

### Flux de Données
- 1. La requête arrive sur l'endpoint
- 2. Les modèles Pydantic valident les données
- 3. Le service LLM traite la demande
- 4. La réponse est formatée et renvoyée vers l'utilisateur
