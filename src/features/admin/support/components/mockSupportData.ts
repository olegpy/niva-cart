import type { SupportChat } from '@/features/support/types';

export const MOCK_SUPPORT_THREADS: SupportChat[] = [
  {
    id: 'thread-demo-1',
    name: 'Maria',
    email: 'maria@example.com',
    status: 'open',
    createdAt: '2026-06-10T14:30:00.000Z',
    updatedAt: '2026-06-10T14:32:00.000Z',
    messages: [
      {
        id: 'msg-demo-1',
        chatId: 'thread-demo-1',
        authorRole: 'customer',
        authorName: 'Maria',
        text: 'Hi, when will my order ship?',
        createdAt: '2026-06-10T14:30:00.000Z',
      },
      {
        id: 'msg-demo-2',
        chatId: 'thread-demo-1',
        authorRole: 'admin',
        authorName: 'Support',
        text: 'Hello Maria! Orders usually ship within 1–2 business days.',
        createdAt: '2026-06-10T14:32:00.000Z',
      },
    ],
  },
  {
    id: 'thread-demo-2',
    name: 'Guest-4821',
    email: 'guest-4821@example.com',
    status: 'open',
    createdAt: '2026-06-11T09:15:00.000Z',
    updatedAt: '2026-06-11T09:15:00.000Z',
    messages: [
      {
        id: 'msg-demo-3',
        chatId: 'thread-demo-2',
        authorRole: 'customer',
        authorName: 'Guest-4821',
        text: 'Do you have this jacket in size L?',
        createdAt: '2026-06-11T09:15:00.000Z',
      },
    ],
  },
];
