import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatRequest, ChatResponse, ChatMessage } from '../models/chat.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8000';
  
  constructor(private http: HttpClient) {}

  sendMessage(message: string, sessionId: string, categoryLabel: string): Observable<ChatResponse> {
    const request: ChatRequest = {
      message,
      session_id: sessionId,
      category_label: categoryLabel,
      user_id: 'test-user'
    };

    console.log('Sending request to:', `${this.apiUrl}/chat/with-category`);
    console.log('Request data:', request);

    return this.http.post<ChatResponse>(`${this.apiUrl}/chat/with-category`, request);
  }

  getHistory(sessionId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/chat/history/${sessionId}`);
  }

  generateSessionId(): string {
    return crypto.randomUUID();
  }
}