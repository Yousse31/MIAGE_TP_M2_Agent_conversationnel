import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { ConversationsListComponent } from './components/conversations-list/conversations-list.component';
import { FormsModule } from '@angular/forms';
import { CategorySelectorComponent } from './components/category-selector/category-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatWindowComponent,
    ConversationsListComponent,
    CategorySelectorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }