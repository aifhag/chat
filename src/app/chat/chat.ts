import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Conversation, ChatMessage } from '../models';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat {
  
  @ViewChild('messageArea') messageArea?: ElementRef<HTMLDivElement>;

  draft = '';
  searchTerm = '';
  isTyping = signal(false);
  activeId = signal(1);
  nextMessageId = 10;
  nextConversationId = 2;

  conversations = signal<Conversation[]>([
    {
      id: 1,
      name: 'Charte Assistente',
      initials: 'Ch',
      color: 'violet',
      status: 'Assistente online',
      messages: [
        { id: 1, text: 'Esse é um chat interativo teste para aplicar no charte', sender: 'bot', time: this.now() },
        { id: 2, text: 'Voce digitou algo e recebi essa mensagem', sender: 'bot', time: this.now() }
      ]
    }
  ]);

  get activeConversation(): Conversation {
    return this.conversations().find(c => c.id === this.activeId()) ?? this.conversations()[0];
  }

  get filteredConversations(): Conversation[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.conversations().filter(c => c.name.toLowerCase().includes(term));
  }

  selectConversation(id: number): void {
    this.activeId.set(id);
    this.scrollToBottom();
  }

  startNewChat(): void {
    const id = this.nextConversationId++;
    const newConversation: Conversation = {
      id,
      name: `Conversa ${id}`,
      initials: 'VC',
      color: 'random color',
      status: 'online',
      messages: [{
        id: this.nextMessageId++,
        text: 'Nova conversa iniciada, essa é uma mensagem padrao',
        sender: 'bot',
        time: this.now()
      }]
    };
    this.conversations.update(items => [newConversation, ...items]);
    this.activeId.set(id);
    this.draft = '';
  }

  sendMessage(): void {
    const text = this.draft.trim();
    if (!text || !this.activeConversation) return;

    const userMessage: ChatMessage = {
      id: this.nextMessageId++,
      text,
      sender: 'user',
      time: this.now()
    };

    this.updateActiveMessages(userMessage);
    this.draft = '';
    this.isTyping.set(true);
    this.scrollToBottom();

    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: this.nextMessageId++,
        text: this.createReply(text),
        sender: 'bot',
        time: this.now()
      };
      this.updateActiveMessages(reply);
      this.isTyping.set(false);
      this.scrollToBottom();
    }, 850);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private updateActiveMessages(message: ChatMessage): void {
    const id = this.activeId();
    this.conversations.update(items =>
      items.map(conversation =>
        conversation.id === id
          ? { ...conversation, messages: [...conversation.messages, message] }
          : conversation
      )
    );
  }

  private createReply(message: string): string {
    const text = message.toLowerCase();

    if (/(oi|olá|ola|bom dia|boa tarde|boa noite)/.test(text)) {
      return 'Ola, saudaçoes essa é uma mensagem padrao';
    }
    if (/(obrigad|valeu)/.test(text)) {
      return 'adeus';
    }
    if (/(seu nome|quem é você|quem e voce)/.test(text)) {
      return 'Eu sou Charte, uma mensageiro padrao criado para conversar com você!';
    }
    if (/(ajuda|ajudar)/.test(text)) {
      return 'Claro!Aqui devem ser colocadas informaçoes sobre o funcionamento do charte.';
    }
    return 'deu merda';
  }

  private now(): string {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const element = this.messageArea?.nativeElement;
      if (element) element.scrollTop = element.scrollHeight;
    }, 50);
  }

  trackByConversation(_index: number, conversation: Conversation): number {
    return conversation.id;
  }

  trackByMessage(_index: number, message: ChatMessage): number {
    return message.id;
  }

 
}
