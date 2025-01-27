import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatRequest, ChatResponse, ChatMessage } from '../models/chat.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8000/chat'; // Ajout du préfixe /chat

  constructor(private http: HttpClient) {}

  sendMessage(message: string, sessionId: string, categoryLabel: string): Observable<ChatResponse> {
    const request: ChatRequest = {
      message,
      session_id: sessionId,
      category_label: categoryLabel,
      user_id: 'test-user' // À remplacer par une vraie gestion d'utilisateur
    };

    // Utilisation de la route correcte /chat/with-category
    return this.http.post<ChatResponse>(`${this.apiUrl}/with-category`, request);
  }

  getHistory(sessionId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/history/${sessionId}`);
  }

  generateSessionId(): string {
    return crypto.randomUUID();
  }
}