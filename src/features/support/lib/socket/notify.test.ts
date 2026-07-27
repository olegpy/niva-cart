import { notifySupportMessage } from './notify';
import { SUPPORT_ROLE } from '@niva/support-realtime';

describe(notifySupportMessage.name, () => {
  const payload = {
    chatId: 'chat-1',
    message: {
      id: 'msg-1',
      chatId: 'chat-1',
      authorRole: SUPPORT_ROLE.CUSTOMER,
      authorName: 'Anna',
      text: 'Hello',
      createdAt: '2026-06-10T14:32:00.000Z',
    },
  };

  const originalFetch = global.fetch;
  const originalBaseUrl = process.env.SOCKET_SERVER_URL;
  const originalSecret = process.env.SOCKET_EMIT_SECRET;

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.SOCKET_SERVER_URL = originalBaseUrl;
    process.env.SOCKET_EMIT_SECRET = originalSecret;
    jest.restoreAllMocks();
  });

  it('does nothing when SOCKET_SERVER_URL is missing', async () => {
    delete process.env.SOCKET_SERVER_URL;
    global.fetch = jest.fn();

    await notifySupportMessage(payload);

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('posts the payload to /emit with the secret header', async () => {
    process.env.SOCKET_SERVER_URL = 'http://localhost:3001';
    process.env.SOCKET_EMIT_SECRET = 'test-secret';
    global.fetch = jest.fn().mockResolvedValue({ ok: true });

    await notifySupportMessage(payload);

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/emit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-secret',
      },
      body: JSON.stringify(payload),
    });
  });

  it('logs when the socket server responds with an error status', async () => {
    process.env.SOCKET_SERVER_URL = 'http://localhost:3001';
    delete process.env.SOCKET_EMIT_SECRET;
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 401 });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    await notifySupportMessage(payload);

    expect(errorSpy).toHaveBeenCalledWith('[support] socket notify failed', 401);
  });

  it('logs when fetch throws', async () => {
    process.env.SOCKET_SERVER_URL = 'http://localhost:3001';
    global.fetch = jest.fn().mockRejectedValue(new Error('network down'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    await notifySupportMessage(payload);

    expect(errorSpy).toHaveBeenCalledWith(
      '[support] socket notify failed',
      expect.any(Error),
    );
  });
});
