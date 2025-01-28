import { Component } from '@angular/core';
import { ChatCategory } from './models/chat.interface';
import { ChatService } from './services/chat.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Finance Chatbot';
  isLoading = false;
  sidenavOpen = false;
  selectedCategory?: ChatCategory;
  sessionId: string;
  userMessage: string = '';
  messages = [
    { role: 'assistant', content: 'Bonjour! Comment puis-je vous aider avec vos questions financières?' }
  ];

  constructor(private chatService: ChatService, private http: HttpClient) {
    this.sessionId = this.chatService.generateSessionId();
  }

  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
  }

  onCategorySelected(category: ChatCategory) {
    this.selectedCategory = category;
    this.messages = [
      { role: 'assistant', content: `Je suis prêt à vous aider avec vos questions concernant ${category}. Que souhaitez-vous savoir ?` }
    ];
  }

  resetToCategories() {
    if (this.messages.length > 1) {
      this.chatService.saveConversation(this.sessionId, this.selectedCategory!, this.messages);
    }
    
    // Réinitialisation de l'état
    this.selectedCategory = undefined;
    this.messages = [
      { role: 'assistant', content: 'Bonjour! Comment puis-je vous aider avec vos questions financières?' }
    ];
    this.sessionId = this.chatService.generateSessionId();
  }

  handleSendMessage(message: string) {
    console.log('handleSendMessage called in app.component with:', message);
    if (!message.trim() || !this.selectedCategory) return;
    
    this.isLoading = true;
    this.messages.push({ role: 'user', content: message });
  
    this.chatService.sendMessage(message, this.sessionId, this.selectedCategory)
      .subscribe({
        next: (response: any) => {
          console.log('Réponse du serveur:', response);
          this.messages.push({ role: 'assistant', content: response.response });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur serveur:', error);
          this.messages.push({
            role: 'assistant',
            content: 'Une erreur est survenue lors de la communication avec le serveur.'
          });
          this.isLoading = false;
        }
      });
  }
  
  
}
