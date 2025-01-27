# api/chat.py
"""
Routes FastAPI pour le chatbot
Inclut les endpoints du TP1 et du TP2
"""
from fastapi import APIRouter, HTTPException, Body
from models.chat import ChatRequestTP1, ChatRequestTP2, ChatRequestWithCategory, ChatRequestWithContext, ChatResponse
from services.llm_service import LLMService
from typing import Dict, List
import uuid

router = APIRouter()
llm_service = LLMService()

@router.post("/chat/simple", response_model=ChatResponse)
async def chat_simple(request: ChatRequestTP1) -> ChatResponse:
    """Endpoint simple du TP1"""
    try:
        session_id = str(uuid.uuid4())  # Generate a unique session ID
        response = await llm_service.generate_response(
            message=request.message,
            session_id=session_id
        )
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat/with-category", response_model=ChatResponse)
async def chat_with_category(request: ChatRequestWithCategory) -> ChatResponse:
    """Endpoint pour une conversation avec catégorie"""
    try:
        print(f"Received request: {request}")  # Log de la requête
        response = await llm_service.generate_response_with_category(
            message=request.message,
            session_id=request.session_id,
            category_label=request.category_label,
            user_id=request.user_id
        )
        print(f"Generated response: {response}")  # Log de la réponse
        return ChatResponse(response=response)
    except Exception as e:
        print(f"Error in chat_with_category: {str(e)}")  # Log de l'erreur
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequestTP2) -> ChatResponse:
    """Nouvel endpoint du TP2 avec gestion de session"""
    try:
        response = await llm_service.generate_response(
            message=request.message,
            session_id=request.session_id
        )
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{session_id}")
async def get_history(session_id: str) -> List[Dict[str, str]]:
    """Récupération de l'historique d'une conversation"""
    try:
        return await llm_service.get_conversation_history(session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/documents")
async def index_documents(
    texts: List[str] = Body(...),
    clear_existing: bool = Body(False)
) -> dict:
    """
    Endpoint pour indexer des documents
    
    Args:
        texts: Liste des textes à indexer
        clear_existing: Si True, supprime l'index existant avant d'indexer
    """
    try:
        await llm_service.rag_service.load_and_index_texts(texts, clear_existing)
        return {"message": "Documents indexed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/documents")
async def clear_documents() -> dict:
    """Endpoint pour supprimer tous les documents indexés"""
    try:
        llm_service.rag_service.clear()
        return {"message": "Vector store cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat/rag", response_model=ChatResponse)
async def chat_rag(request: ChatRequestTP2) -> ChatResponse:
    """Endpoint de chat utilisant le RAG"""
    try:
        response = await llm_service.generate_response(
            message=request.message,
            session_id=request.session_id,
            use_rag=True
        )
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))