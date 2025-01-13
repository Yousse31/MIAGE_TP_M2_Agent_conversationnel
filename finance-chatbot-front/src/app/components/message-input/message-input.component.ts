import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css']
})
export class MessageInputComponent {
  // Propriété pour stocker le message
  message = '';

  // Événement pour émettre le message au parent
  @Output() sendMessage = new EventEmitter<string>();

  /**
   * Méthode appelée pour envoyer un message
   */
  send() {
    if (this.message.trim()) {
      this.sendMessage.emit(this.message); // Émet le message
      this.message = ''; // Réinitialise le champ
    }
  }
}
