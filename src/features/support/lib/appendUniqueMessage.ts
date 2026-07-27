import type { ChatMessage } from '@/features/support/types';

export function appendUniqueMessage(
  prev: ChatMessage[],
  message: ChatMessage,
): ChatMessage[] {
  if (prev.some((item) => item.id === message.id)) return prev;
  return [...prev, message];
}
