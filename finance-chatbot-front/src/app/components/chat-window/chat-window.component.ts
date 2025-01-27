import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatCategory } from '../../models/chat.interface';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent {
  @Input() messages: any[] = [];
  @Input() selectedCategory?: ChatCategory;
  @Output() onSendMessage = new EventEmitter<string>(); // Renommé pour plus de clarté
  
  message: string = '';

  sendMessage(): void {
    console.log('Send message called');
    if (!this.message.trim()) return;
    
    console.log('Emitting message:', this.message);
    this.onSendMessage.emit(this.message);
    this.message = '';
  }
}