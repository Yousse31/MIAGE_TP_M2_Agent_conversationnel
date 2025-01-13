import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'finance-chatbot';
  isLoading = false; // État de chargement
  messages = [
    { role: 'user', content: 'Hi there! What can you do?' },
    { role: 'assistant', content: 'I can help you with financial queries. Ask me anything!' },
  ];

  handleSendMessage(message: string) {
    if (!message.trim()) return;

    this.isLoading = true; // Activer le loader
    this.messages.push({ role: 'user', content: message });

    setTimeout(() => {
      this.messages.push({
        role: 'assistant',
        content: `You said: "${message}". This is a mock response.`,
      });
      this.isLoading = false; // Désactiver le loader
    }, 1000); // Simule un délai pour la réponse
  }
}
