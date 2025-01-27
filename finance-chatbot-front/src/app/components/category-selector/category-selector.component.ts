// category-selector.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { ChatCategory } from '../../models/chat.interface';

@Component({
  selector: 'app-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.css']
})
export class CategorySelectorComponent {
  @Output() categorySelected = new EventEmitter<ChatCategory>();
  
  ChatCategory = ChatCategory; // Pour l'utiliser dans le template

  selectCategory(category: ChatCategory) {
    this.categorySelected.emit(category);
  }
}