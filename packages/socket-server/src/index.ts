import 'dotenv/config';
import { createSupportSocketServer } from './createServer';

const PORT = Number(process.env.PORT ?? process.env.SOCKET_PORT ?? 3001);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:3000';
const EMIT_SECRET = process.env.SOCKET_EMIT_SECRET;

const { httpServer } = createSupportSocketServer({
  corsOrigin: CORS_ORIGIN,
  emitSecret: EMIT_SECRET,
});

httpServer.listen(PORT, () => {
  console.log(`[socket] listening on http://localhost:${PORT}`);
  console.log(`[socket] cors origin: ${CORS_ORIGIN}`);
});
