import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Finance Chatbot';
  isLoading = false;
  sidenavOpen = false;
  messages = [
    { role: 'assistant', content: 'Bonjour! Comment puis-je vous aider avec vos questions financières?' }
  ];

  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
  }

  handleSendMessage(message: string) {
    if (!message.trim()) return;
    
    this.isLoading = true;
    this.messages.push({ role: 'user', content: message });

    setTimeout(() => {
      this.messages.push({
        role: 'assistant',
        content: `Vous avez dit : "${message}". Ceci est une réponse simulée.`
      });
      this.isLoading = false;
    }, 1000);
  }
}