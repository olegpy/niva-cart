import { startChatAction } from './startChat';

const mockCreate = jest.fn();
const mockNotifySupportMessage = jest.fn();

jest.mock('@/shared/lib/prisma', () => ({
  prisma: {
    supportChat: {
      create: (...args: unknown[]) => mockCreate(...args),
    },
  },
}));

jest.mock('@/features/support/lib/socket/notify', () => ({
  notifySupportMessage: (...args: unknown[]) => mockNotifySupportMessage(...args),
}));

function formData(entries: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    data.set(key, value);
  }
  return data;
}

describe(startChatAction.name, () => {
  beforeEach(() => {
    mockCreate.mockReset();
    mockNotifySupportMessage.mockReset();
    mockNotifySupportMessage.mockResolvedValue(undefined);
  });

  it('returns validation errors for missing fields', async () => {
    await expect(
      startChatAction({}, formData({ name: '', email: 'a@b.com', question: 'Hi' })),
    ).resolves.toEqual({ ok: false, error: 'Please enter your name.' });

    await expect(
      startChatAction({}, formData({ name: 'Anna', email: '', question: 'Hi' })),
    ).resolves.toEqual({ ok: false, error: 'Please enter your email.' });

    await expect(
      startChatAction({}, formData({ name: 'Anna', email: 'bad', question: 'Hi' })),
    ).resolves.toEqual({
      ok: false,
      error: 'Please enter a valid email address.',
    });

    await expect(
      startChatAction(
        {},
        formData({ name: 'Anna', email: 'anna@example.com', question: '' }),
      ),
    ).resolves.toEqual({ ok: false, error: 'Please enter your question.' });

    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('creates a chat and notifies the socket server with the first message', async () => {
    const createdAt = new Date('2026-06-10T14:00:00.000Z');
    const updatedAt = new Date('2026-06-10T14:00:00.000Z');

    mockCreate.mockResolvedValue({
      id: 'chat-1',
      name: 'Anna',
      email: 'anna@example.com',
      status: 'open',
      createdAt,
      updatedAt,
      messages: [
        {
          id: 'msg-1',
          chatId: 'chat-1',
          authorRole: 'customer',
          authorName: 'Anna',
          text: 'Need help with an order',
          createdAt,
        },
      ],
    });

    const result = await startChatAction(
      {},
      formData({
        name: 'Anna',
        email: 'anna@example.com',
        question: 'Need help with an order',
      }),
    );

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        name: 'Anna',
        email: 'anna@example.com',
        messages: {
          create: {
            authorRole: 'customer',
            authorName: 'Anna',
            text: 'Need help with an order',
          },
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    expect(mockNotifySupportMessage).toHaveBeenCalledWith({
      chatId: 'chat-1',
      message: {
        id: 'msg-1',
        chatId: 'chat-1',
        authorRole: 'customer',
        authorName: 'Anna',
        text: 'Need help with an order',
        createdAt: '2026-06-10T14:00:00.000Z',
      },
    });

    expect(result).toEqual({
      ok: true,
      data: {
        id: 'chat-1',
        name: 'Anna',
        email: 'anna@example.com',
        status: 'open',
        createdAt: '2026-06-10T14:00:00.000Z',
        updatedAt: '2026-06-10T14:00:00.000Z',
        messages: [
          {
            id: 'msg-1',
            chatId: 'chat-1',
            authorRole: 'customer',
            authorName: 'Anna',
            text: 'Need help with an order',
            createdAt: '2026-06-10T14:00:00.000Z',
          },
        ],
      },
    });
  });
});
