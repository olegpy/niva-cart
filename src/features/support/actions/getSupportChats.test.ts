import { getSupportChatsAction } from './getSupportChats';

jest.mock('@/shared/lib/prisma', () => ({
  prisma: {
    supportChat: {
      findMany: jest.fn(),
    },
  },
}));

import { prisma } from '@/shared/lib/prisma';

const findMany = prisma.supportChat.findMany as jest.Mock;

const dbChat = {
  id: 'chat-1',
  name: 'Test',
  email: 'test@example.com',
  status: 'open',
  createdAt: new Date('2026-06-10T14:30:00.000Z'),
  updatedAt: new Date('2026-06-10T14:32:00.000Z'),
  messages: [],
};

const expectedChat = {
  ...dbChat,
  createdAt: '2026-06-10T14:30:00.000Z',
  updatedAt: '2026-06-10T14:32:00.000Z',
};
describe(getSupportChatsAction.name, () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it('returns serialized chats ordered by updatedAt desc', async () => {
    findMany.mockResolvedValue([dbChat]);

    const result = await getSupportChatsAction();

    expect(findMany).toHaveBeenCalledWith({
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    expect(result).toEqual([expectedChat]);
  });

  it('returns an empty array when there are no chats', async () => {
    findMany.mockResolvedValue([]);

    await expect(getSupportChatsAction()).resolves.toEqual([]);
  });
});
