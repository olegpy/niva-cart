import { sendAdminReplyAction } from './sendAdminReply';

const mockGetServerSession = jest.fn();
const mockFindUnique = jest.fn();
const mockTransaction = jest.fn();

jest.mock('next-auth', () => ({
  getServerSession: (...args: unknown[]) => mockGetServerSession(...args),
}));

jest.mock('@/features/admin/auth/lib/auth', () => ({
  authOptions: {},
}));

jest.mock('@/shared/lib/prisma', () => ({
  prisma: {
    supportChat: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
    },
    $transaction: (fn: (tx: unknown) => unknown) => mockTransaction(fn),
  },
}));

function formData(entries: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    data.set(key, value);
  }
  return data;
}

describe(sendAdminReplyAction.name, () => {
  beforeEach(() => {
    mockGetServerSession.mockReset();
    mockFindUnique.mockReset();
    mockTransaction.mockReset();
  });

  it('returns unauthorized when there is no admin session', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const result = await sendAdminReplyAction({}, formData({ chatId: 'c1', text: 'Hi' }));

    expect(result).toEqual({
      ok: false,
      error: 'Unauthorized. You must be an admin to send a reply.',
    });
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it('returns unauthorized when session user is not an admin', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { role: 'customer', name: 'User' },
    });

    const result = await sendAdminReplyAction({}, formData({ chatId: 'c1', text: 'Hi' }));

    expect(result).toEqual({
      ok: false,
      error: 'Unauthorized. You must be an admin to send a reply.',
    });
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it('returns validation error for empty text', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { role: 'admin', name: 'Admin' },
    });

    const result = await sendAdminReplyAction({}, formData({ chatId: 'c1', text: '   ' }));

    expect(result).toEqual({
      ok: false,
      error: 'Message cannot be empty.',
    });
  });

  it('returns error when chatId is missing', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { role: 'admin', name: 'Admin' },
    });

    const result = await sendAdminReplyAction({}, formData({ chatId: '  ', text: 'Hi' }));

    expect(result).toEqual({
      ok: false,
      error: 'Conversation not found.',
    });
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it('returns error when chat is not found', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { role: 'admin', name: 'Admin' },
    });
    mockFindUnique.mockResolvedValue(null);

    const result = await sendAdminReplyAction(
      {},
      formData({ chatId: 'missing', text: 'Hi' }),
    );

    expect(result).toEqual({
      ok: false,
      error: 'Conversation not found.',
    });
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it('returns error when chat is closed', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { role: 'admin', name: 'Admin' },
    });
    mockFindUnique.mockResolvedValue({ id: 'c1', status: 'closed' });

    const result = await sendAdminReplyAction(
      {},
      formData({ chatId: 'c1', text: 'Still open?' }),
    );

    expect(result).toEqual({
      ok: false,
      error: 'The Conversation is closed.',
    });
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it('creates an admin message when chat is open', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { role: 'admin', name: 'Admin User' },
    });
    mockFindUnique.mockResolvedValue({ id: 'c1', status: 'open' });

    const createdAt = new Date('2026-06-10T15:00:00.000Z');
    const create = jest.fn().mockResolvedValue({
      id: 'msg-1',
      chatId: 'c1',
      authorRole: 'admin',
      authorName: 'Admin User',
      text: 'We can help',
      createdAt,
    });
    const update = jest.fn().mockResolvedValue({});

    mockTransaction.mockImplementation(async (fn) =>
      fn({ chatMessage: { create }, supportChat: { update } }),
    );

    const result = await sendAdminReplyAction(
      {},
      formData({ chatId: 'c1', text: 'We can help' }),
    );

    expect(create).toHaveBeenCalledWith({
      data: {
        chatId: 'c1',
        text: 'We can help',
        authorName: 'Admin User',
        authorRole: 'admin',
      },
    });
    expect(update).toHaveBeenCalled();
    expect(result).toEqual({
      ok: true,
      data: {
        id: 'msg-1',
        chatId: 'c1',
        authorRole: 'admin',
        authorName: 'Admin User',
        text: 'We can help',
        createdAt: '2026-06-10T15:00:00.000Z',
      },
    });
  });
});
