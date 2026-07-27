import { sendMessageAction } from './sendMessage';

const mockFindUnique = jest.fn();
const mockTransaction = jest.fn();
const mockNotifySupportMessage = jest.fn();

jest.mock('@/shared/lib/prisma', () => ({
  prisma: {
    supportChat: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
    },
    $transaction: (fn: (tx: unknown) => unknown) => mockTransaction(fn),
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

describe(sendMessageAction.name, () => {
  beforeEach(() => {
    mockFindUnique.mockReset();
    mockTransaction.mockReset();
    mockNotifySupportMessage.mockReset();
    mockNotifySupportMessage.mockResolvedValue(undefined);
  });

  it('returns validation error for empty text', async () => {
    const result = await sendMessageAction(
      {},
      formData({ chatId: 'c1', text: '   ', authorName: 'Anna' }),
    );

    expect(result).toEqual({
      ok: false,
      error: 'Message cannot be empty.',
    });
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it('returns error when chatId is missing', async () => {
    const result = await sendMessageAction(
      {},
      formData({ chatId: '  ', text: 'Hello', authorName: 'Anna' }),
    );

    expect(result).toEqual({
      ok: false,
      error: 'Chat session not found. Please start a new conversation.',
    });
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it('returns error when chat is not found', async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await sendMessageAction(
      {},
      formData({ chatId: 'missing', text: 'Hello', authorName: 'Anna' }),
    );

    expect(result).toEqual({
      ok: false,
      error: 'Chat session not found. Please start a new conversation.',
    });
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it('returns error when chat is closed', async () => {
    mockFindUnique.mockResolvedValue({ id: 'c1', status: 'closed' });

    const result = await sendMessageAction(
      {},
      formData({ chatId: 'c1', text: 'Hello', authorName: 'Anna' }),
    );

    expect(result).toEqual({
      ok: false,
      error: 'This conversation is closed.',
    });
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it('creates a customer message and notifies the socket server', async () => {
    mockFindUnique.mockResolvedValue({ id: 'c1', status: 'open' });

    const createdAt = new Date('2026-06-10T15:00:00.000Z');
    const create = jest.fn().mockResolvedValue({
      id: 'msg-1',
      chatId: 'c1',
      authorRole: 'customer',
      authorName: 'Anna',
      text: 'Hello',
      createdAt,
    });
    const update = jest.fn().mockResolvedValue({});

    mockTransaction.mockImplementation(async (fn) =>
      fn({ chatMessage: { create }, supportChat: { update } }),
    );

    const result = await sendMessageAction(
      {},
      formData({ chatId: 'c1', text: 'Hello', authorName: 'Anna' }),
    );

    expect(create).toHaveBeenCalledWith({
      data: {
        chatId: 'c1',
        authorRole: 'customer',
        authorName: 'Anna',
        text: 'Hello',
      },
    });
    expect(mockNotifySupportMessage).toHaveBeenCalledWith({
      chatId: 'c1',
      message: {
        id: 'msg-1',
        chatId: 'c1',
        authorRole: 'customer',
        authorName: 'Anna',
        text: 'Hello',
        createdAt: '2026-06-10T15:00:00.000Z',
      },
    });
    expect(result).toEqual({
      ok: true,
      data: {
        id: 'msg-1',
        chatId: 'c1',
        authorRole: 'customer',
        authorName: 'Anna',
        text: 'Hello',
        createdAt: '2026-06-10T15:00:00.000Z',
      },
    });
  });
});
