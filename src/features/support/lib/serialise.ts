import type {
    ChatMessage as DbChatMessage,
    SupportChat as DbSupportChat,
  } from '@prisma/client';
  import type { ChatMessage, SupportChat } from '@/features/support/types';

  export function serializeMessage(message: DbChatMessage): ChatMessage {
    return {
      id: message.id,
      chatId: message.chatId,
      authorRole: message.authorRole,
      authorName: message.authorName,
      text: message.text,
      createdAt: message.createdAt.toISOString(), // only here
    };
  }
  
  export function serializeChat(
    chat: DbSupportChat & { messages: DbChatMessage[] },
  ): SupportChat {
    return {
      id: chat.id,
      name: chat.name,
      email: chat.email,
      status: chat.status,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
      messages: chat.messages.map(serializeMessage),
    };
  }