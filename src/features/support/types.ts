export type MessageAuthorRole = 'customer' | 'admin';
export type ChatStatus = 'open' | 'closed';

export interface ChatMessage {
  id: string;
  chatId: string;
  authorRole: MessageAuthorRole;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface SupportChat {
  id: string;
  name: string;
  email: string;
  status: ChatStatus;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}