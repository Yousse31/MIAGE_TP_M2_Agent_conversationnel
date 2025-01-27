import { Component, Input } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatCategory } from '../../models/chat.interface';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent {
  @Input() messages: any[] = [];
  @Input() selectedCategory?: ChatCategory;
  message: string = '';
  sessionId: string;
  
  constructor(private chatService: ChatService) {
    this.sessionId = this.chatService.generateSessionId();
  }

  sendMessage(): void {
    if (!this.message.trim() || !this.selectedCategory) return;
    
    const currentMessage = this.message;
    this.messages.push({ role: 'user', content: currentMessage });
    this.message = '';

    this.chatService.sendMessage(currentMessage, this.sessionId, this.selectedCategory)
      .subscribe({
        next: (response) => {
          this.messages.push({ role: 'assistant', content: response.response });
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.messages.push({
            role: 'assistant',
            content: 'Une erreur est survenue.'
          });
        }
      });
  }
}