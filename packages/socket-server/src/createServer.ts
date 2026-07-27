import { createServer, type Server as HttpServer } from 'node:http';
import { Server as SocketServer } from 'socket.io';
import {
  ADMIN_INBOX_ROOM,
  SUPPORT_EVENTS,
  SUPPORT_ROLE,
  type SupportJoinPayload,
  type SupportMessagePayload,
} from '@niva/support-realtime';

export type CreateSupportSocketServerOptions = {
  corsOrigin?: string;
  emitSecret?: string;
};

export type SupportSocketServer = {
  httpServer: HttpServer;
  io: SocketServer;
};

export function createSupportSocketServer(
  options: CreateSupportSocketServerOptions = {},
): SupportSocketServer {
  const corsOrigin = options.corsOrigin ?? 'http://localhost:3000';
  const emitSecret = options.emitSecret;

  const httpServer = createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/emit') {
      if (emitSecret) {
        const auth = req.headers.authorization;
        if (auth !== `Bearer ${emitSecret}`) {
          res.writeHead(401);
          res.end('unauthorized');
          return;
        }
      }

      let body = '';
      for await (const chunk of req) {
        body += chunk;
      }

      try {
        const payload = JSON.parse(body) as SupportMessagePayload;

        if (!payload?.chatId || !payload?.message) {
          res.writeHead(400);
          res.end('invalid payload');
          return;
        }

        io.to(`chat:${payload.chatId}`).emit(SUPPORT_EVENTS.MESSAGE, payload);
        io.to(ADMIN_INBOX_ROOM).emit(SUPPORT_EVENTS.MESSAGE, payload);

        console.log('[socket] emit', SUPPORT_EVENTS.MESSAGE, {
          chatId: payload.chatId,
          messageId: payload.message.id,
        });

        res.writeHead(204);
        res.end();
      } catch (error) {
        console.error('[socket] bad /emit', error);
        res.writeHead(400);
        res.end('bad request');
      }
      return;
    }

    if (req.method === 'GET' && (req.url === '/' || req.url === '/health')) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('socket server ok');
      return;
    }

    res.writeHead(404);
    res.end('not found');
  });

  const io = new SocketServer(httpServer, {
    cors: {
      origin: corsOrigin,
    },
  });

  io.on('connection', (socket) => {
    console.log('[socket] connected', socket.id);

    socket.on(SUPPORT_EVENTS.JOIN, (payload: SupportJoinPayload) => {
      if (payload?.chatId) {
        socket.join(`chat:${payload.chatId}`);
      }

      if (payload.role === SUPPORT_ROLE.ADMIN) {
        socket.join(ADMIN_INBOX_ROOM);
      }

      console.log('[socket] join', {
        socketId: socket.id,
        chatId: payload.chatId,
        role: payload.role,
      });
    });

    socket.on('disconnect', () => {
      console.log('[socket] disconnected', socket.id);
    });
  });

  return { httpServer, io };
}
