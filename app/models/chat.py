# models/chat.py
"""
Modèles Pydantic pour la validation des données
Inclut les modèles du TP1 et les nouveaux modèles pour le TP2
"""
from typing import Dict, List, Optional
from pydantic import BaseModel

from services.llm_service import LLMService

# ---- Modèles du TP1 ----
class ChatRequestTP1(BaseModel):
    """Requête de base pour une conversation sans contexte"""
    message: str

class ChatResponse(BaseModel):
    """Réponse standard du chatbot"""
    response: str

class ChatRequestWithContext(BaseModel):
    """Requête avec contexte de conversation du TP1"""
    message: str
    context: Optional[List[Dict[str, str]]] = []

# ---- Nouveaux modèles pour le TP2 ----

class ChatRequestTP2(BaseModel):
    """Requête de base pour une conversation sans contexte"""
    message: str
    session_id: str  # Ajouté pour supporter les deux versions

class ChatMessage(BaseModel):
    """Structure d'un message individuel dans l'historique"""
    role: str  # "user" ou "assistant"
    content: str

class ChatHistory(BaseModel):
    """Collection de messages formant une conversation"""
    messages: List[ChatMessage]

class ChatRequestWithCategory(BaseModel):
    """Requête pour une conversation avec catégorie"""
    message: str
    session_id: str
    category_label: str
    user_id: str

from pydantic import BaseModel, Field
from typing import List, Optional

class SummaryRequest(BaseModel):
    text: str
    max_length: Optional[int] = 1000

class SummaryResponse(BaseModel):
    full_summary: str
    bullet_points: List[str]
    one_liner: str

from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.post("/summarize", response_model=SummaryResponse)
async def summarize_text(request: SummaryRequest):
    try:
        summary = await LLMService.generate_summary(request.text)
        return SummaryResponse(**summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/assistant/tool", response_model=ChatResponse)
async def use_tool(request: ChatRequestTP2):
    try:
        response = await LLMService.process_with_tools(request.message)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))