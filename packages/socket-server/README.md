# niva-cart-socket

Socket.IO microservice for support chat realtime.

```text
packages/
  support-realtime/   ← event names + payload types (shared)
  socket-server/      ← this service (rooms, /emit, push)
```

## Local

From repo root:

```bash
npm install
cp packages/socket-server/.env.example packages/socket-server/.env
npm run socket:dev
```

## Env

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | no | Default `3001` |
| `CORS_ORIGIN` | no | Default `http://localhost:3000` |
| `SOCKET_EMIT_SECRET` | recommended | Bearer token for `POST /emit` |

## Test

```bash
npm run test:socket
# or: npm test -w niva-cart-socket
```

- `GET /health` — ok
- `POST /emit` — `{ chatId, message }`
- Events from `@niva/support-realtime`: `support:join`, `support:message`
