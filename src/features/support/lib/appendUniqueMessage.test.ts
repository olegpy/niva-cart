import { appendUniqueMessage } from './appendUniqueMessage';
import type { ChatMessage } from '@/features/support/types';
import { SUPPORT_ROLE } from '@niva/support-realtime';

const message = (id: string, text = 'Hi'): ChatMessage => ({
  id,
  chatId: 'chat-1',
  authorRole: SUPPORT_ROLE.CUSTOMER,
  authorName: 'Anna',
  text,
  createdAt: '2026-06-10T14:32:00.000Z',
});

describe(appendUniqueMessage.name, () => {
  it('appends a message that is not already in the list', () => {
    const prev = [message('m1')];
    const next = appendUniqueMessage(prev, message('m2', 'Hello'));

    expect(next).toHaveLength(2);
    expect(next[1].id).toBe('m2');
    expect(next).not.toBe(prev);
  });

  it('returns the same array when the message id already exists', () => {
    const prev = [message('m1'), message('m2')];
    const next = appendUniqueMessage(prev, message('m1', 'duplicate'));

    expect(next).toBe(prev);
    expect(next).toHaveLength(2);
  });
});
