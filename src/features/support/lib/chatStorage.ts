const CHAT_ID_KEY = 'niva_support_chat_id';

export function saveChatId(chatId: string): void {
  localStorage.setItem(CHAT_ID_KEY, chatId);
}
export function readChatId(): string | null {
  return localStorage.getItem(CHAT_ID_KEY);
}
export function clearChatId(): void {
  localStorage.removeItem(CHAT_ID_KEY);
}