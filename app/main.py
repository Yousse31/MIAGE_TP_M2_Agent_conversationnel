from dotenv import load_dotenv
"""
Ce module configure et exécute une application FastAPI pour un agent conversationnel.
Modules:
    dotenv: Charge les variables d'environnement à partir d'un fichier .env.
    fastapi: Fournit le framework FastAPI pour construire des APIs.
    fastapi.middleware.cors: Fournit un middleware pour gérer le partage des ressources entre origines (CORS).
    api.router: Contient les routes API à inclure dans l'application FastAPI.
    services.llm_service: Fournit la classe LLMService pour gérer les services de modèle de langage.
    uvicorn: Serveur ASGI pour exécuter l'application FastAPI.
Attributs:
    app (FastAPI): L'instance de l'application FastAPI.
    llm_service (LLMService): Une instance de la classe LLMService.
Middleware:
    CORSMiddleware: Middleware pour gérer le CORS, permettant toutes les origines, les identifiants, les méthodes et les en-têtes.
Routes:
    api_router: Le routeur contenant les routes API à inclure dans l'application FastAPI.
Fonctions:
    main: Exécute l'application FastAPI en utilisant uvicorn si le module est exécuté en tant que programme principal.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.router import router as api_router
from services.llm_service import LLMService
import uvicorn

load_dotenv()

app = FastAPI(
    title="Agent conversationnel",
    description="API pour un agent conversationnel donné lors du TP1",
    version="1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instance du service LLM
llm_service = LLMService()

# Inclure les routes
app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)