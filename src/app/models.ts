export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

export interface Conversation {
  id: number;
  name: string;
  initials: string;
  color: string;
  status: string;
  messages: ChatMessage[];
}
