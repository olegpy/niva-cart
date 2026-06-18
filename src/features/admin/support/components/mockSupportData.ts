import type { SupportThread } from '@/features/admin/support/types';

export const MOCK_SUPPORT_THREADS: SupportThread[] = [
  {
    id: 'thread-demo-1',
    customerName: 'Maria',
    createdAt: '2026-06-10T14:30:00.000Z',
    updatedAt: '2026-06-10T14:32:00.000Z',
    messages: [
      {
        id: 'msg-demo-1',
        authorRole: 'customer',
        authorName: 'Maria',
        text: 'Hi, when will my order ship?',
        createdAt: '2026-06-10T14:30:00.000Z',
      },
      {
        id: 'msg-demo-2',
        authorRole: 'admin',
        authorName: 'Support',
        text: 'Hello Maria! Orders usually ship within 1–2 business days.',
        createdAt: '2026-06-10T14:32:00.000Z',
      },
    ],
  },
  {
    id: 'thread-demo-2',
    customerName: 'Guest-4821',
    createdAt: '2026-06-11T09:15:00.000Z',
    updatedAt: '2026-06-11T09:15:00.000Z',
    messages: [
      {
        id: 'msg-demo-3',
        authorRole: 'customer',
        authorName: 'Guest-4821',
        text: 'Do you have this jacket in size L?',
        createdAt: '2026-06-11T09:15:00.000Z',
      },
    ],
  },
];
