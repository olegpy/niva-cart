export const SUPPORT_EVENTS = {
  JOIN: 'support:join',
  MESSAGE: 'support:message',
} as const;

export const ADMIN_INBOX_ROOM = 'admin:inbox';

export const SUPPORT_ROLE = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
} as const;

export type SupportRole = (typeof SUPPORT_ROLE)[keyof typeof SUPPORT_ROLE];

/** Minimal message shape shared by Next app + socket microservice */
export type SupportRealtimeMessage = {
  id: string;
  chatId: string;
  authorRole: SupportRole;
  authorName: string;
  text: string;
  createdAt: string;
};

export type SupportJoinPayload = {
  chatId?: string;
  role?: SupportRole;
};

export type SupportMessagePayload = {
  chatId: string;
  message: SupportRealtimeMessage;
};
