import { Component, Input, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements AfterViewChecked {
  @Input() messages: { role: string; content: string }[] = []; // Les messages passés en entrée
  @ViewChild('messagesEnd') private messagesEnd!: ElementRef; // Référence à l'élément de fin

  message: string = ''; // Message saisi par l'utilisateur

  // Défile automatiquement vers le bas à chaque mise à jour
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.messagesEnd) {
      this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Méthode pour envoyer un message
   */
  sendMessage(): void {
    if (this.message.trim()) {
      this.messages.push({ role: 'user', content: this.message }); // Ajoute le message à la liste
      this.message = ''; // Réinitialise le champ de saisie

      // Simule une réponse de l'assistant après un délai
      setTimeout(() => {
        this.messages.push({
          role: 'assistant',
          content: `Vous avez dit : "${this.message}". Ceci est une réponse simulée.`
        });
      }, 1000);
    }
  }
}
