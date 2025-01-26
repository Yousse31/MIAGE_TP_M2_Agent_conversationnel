import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-conversations-list',
  templateUrl: './conversations-list.component.html',
  styleUrls: ['./conversations-list.component.css'],
})
export class ConversationsListComponent {
  @Input() sessions: string[] = []; // Liste des sessions
  @Input() currentSession: string = ''; // Session actuelle
  @Output() sessionChange = new EventEmitter<string>();

  isSidebarOpen = false; // État de la sidebar

  /**
   * Méthode pour basculer l'état de la sidebar.
   */
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  /**
   * Méthode pour gérer le changement de session.
   * @param session - La session sélectionnée
   */
  changeSession(session: string) {
    this.sessionChange.emit(session);
  }
}
