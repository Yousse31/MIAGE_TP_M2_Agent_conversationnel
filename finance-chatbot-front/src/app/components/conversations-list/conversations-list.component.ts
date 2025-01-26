/* conversations-list.component.ts */
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-conversations-list',
  templateUrl: './conversations-list.component.html',
  styleUrls: ['./conversations-list.component.css'],
})
export class ConversationsListComponent {
  @Input() sessions: string[] = [];
  @Input() currentSession: string = '';
  @Output() sessionChange = new EventEmitter<string>();

  changeSession(session: string) {
    this.sessionChange.emit(session);
  }
}