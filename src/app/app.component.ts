import { Component } from '@angular/core';
import { Chat } from './chat/chat';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Chat],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}