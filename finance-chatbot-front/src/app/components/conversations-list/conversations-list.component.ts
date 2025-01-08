import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-conversations-list',
  templateUrl: './conversations-list.component.html',
  styleUrls: ['./conversations-list.component.css'],
})
export class ConversationsListComponent {
  // Propriétés passées par le parent
  @Input() sessions: string[] = []; // Liste des sessions
  @Input() currentSession: string = ''; // Session actuelle

  // Événement pour signaler un changement de session
  @Output() sessionChange = new EventEmitter<string>();

  /**
   * Méthode pour gérer le changement de session.
   * @param session - La session sélectionnée
   */
  changeSession(session: string) {
    this.sessionChange.emit(session);
  }
}
