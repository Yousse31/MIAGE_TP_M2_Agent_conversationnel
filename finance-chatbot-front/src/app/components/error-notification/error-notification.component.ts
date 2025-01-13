import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-notification',
  templateUrl: './error-notification.component.html',
  styleUrls: ['./error-notification.component.css'],
})
export class ErrorNotificationComponent {
  // Message d'erreur passé au composant
  @Input() message: string = '';
}
