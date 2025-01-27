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

  handleSendMessage(message: string) {
    console.log('handleSendMessage called in app.component with:', message);
    if (!message.trim() || !this.selectedCategory) return;
  
    this.isLoading = true;
    this.messages.push({ role: 'user', content: message });
  
    // Construire la requête en ajoutant user_id uniquement si la catégorie est "opération"
    const requestBody: any = {
      message: message,
      category_label: this.selectedCategory
    };
  
    if (this.selectedCategory === ChatCategory.OPERATIONS) {
      requestBody.user_id = "677e7d90c501a6ab02049eed"; // Ajout de l'identifiant utilisateur pour accès à ses comptes
    }
  
    this.http.post('http://localhost:8000/chat/with-category', requestBody) // Envoi de la requête au serveur
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
  
    this.userMessage = '';  // Nettoyage du champ après envoi
  }
  
  
}
