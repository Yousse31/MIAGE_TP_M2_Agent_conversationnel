import { Component, Input, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements AfterViewChecked {
  @Input() messages: { role: string; content: string }[] = []; // Les messages passés en entrée
  @ViewChild('messagesEnd') private messagesEnd!: ElementRef; // Référence à l'élément de fin

  // Défile automatiquement vers le bas à chaque mise à jour
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.messagesEnd) {
      this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
