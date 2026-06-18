export type SupportAuthorRole = 'customer' | 'admin';

export interface SupportMessage {
  id: string;
  authorRole: SupportAuthorRole;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface SupportThread {
  id: string;
  customerName: string;
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
}
