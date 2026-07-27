import { SUPPORT_ROLE } from '@niva/support-realtime';
import type { AddressInfo } from 'node:net';
import { createSupportSocketServer } from './createServer';

const EMIT_SECRET = 'test-secret';

function listen(httpServer: ReturnType<typeof createSupportSocketServer>['httpServer']) {
  return new Promise<number>((resolve, reject) => {
    httpServer.listen(0, '127.0.0.1', () => {
      const address = httpServer.address() as AddressInfo | null;
      if (!address) {
        reject(new Error('server address unavailable'));
        return;
      }
      resolve(address.port);
    });
  });
}

function close(httpServer: ReturnType<typeof createSupportSocketServer>['httpServer']) {
  return new Promise<void>((resolve, reject) => {
    httpServer.close((error) => (error ? reject(error) : resolve()));
  });
}

describe(createSupportSocketServer.name, () => {
  it('responds on GET /health', async () => {
    const { httpServer, io } = createSupportSocketServer({ emitSecret: EMIT_SECRET });
    const port = await listen(httpServer);

    try {
      const response = await fetch(`http://127.0.0.1:${port}/health`);
      expect(response.status).toBe(200);
      expect(await response.text()).toBe('socket server ok');
    } finally {
      io.close();
      await close(httpServer);
    }
  });

  it('rejects /emit without a valid secret', async () => {
    const { httpServer, io } = createSupportSocketServer({ emitSecret: EMIT_SECRET });
    const port = await listen(httpServer);

    try {
      const response = await fetch(`http://127.0.0.1:${port}/emit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: 'c1',
          message: {
            id: 'm1',
            chatId: 'c1',
            authorRole: SUPPORT_ROLE.CUSTOMER,
            authorName: 'Anna',
            text: 'Hi',
            createdAt: '2026-06-10T14:32:00.000Z',
          },
        }),
      });

      expect(response.status).toBe(401);
    } finally {
      io.close();
      await close(httpServer);
    }
  });

  it('rejects /emit with an invalid payload', async () => {
    const { httpServer, io } = createSupportSocketServer({ emitSecret: EMIT_SECRET });
    const port = await listen(httpServer);

    try {
      const response = await fetch(`http://127.0.0.1:${port}/emit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${EMIT_SECRET}`,
        },
        body: JSON.stringify({ chatId: 'c1' }),
      });

      expect(response.status).toBe(400);
    } finally {
      io.close();
      await close(httpServer);
    }
  });

  it('accepts a valid /emit request', async () => {
    const { httpServer, io } = createSupportSocketServer({ emitSecret: EMIT_SECRET });
    const port = await listen(httpServer);

    try {
      const response = await fetch(`http://127.0.0.1:${port}/emit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${EMIT_SECRET}`,
        },
        body: JSON.stringify({
          chatId: 'c1',
          message: {
            id: 'm1',
            chatId: 'c1',
            authorRole: SUPPORT_ROLE.ADMIN,
            authorName: 'Support',
            text: 'Hello',
            createdAt: '2026-06-10T14:32:00.000Z',
          },
        }),
      });

      expect(response.status).toBe(204);
    } finally {
      io.close();
      await close(httpServer);
    }
  });
});
