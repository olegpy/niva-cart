# niva-cart-socket

Socket.IO microservice for support chat. Next.js saves messages to Postgres, then calls `POST /emit`; this service pushes to rooms. It does not write to the DB.

```text
packages/support-realtime  →  events + types
packages/socket-server     →  this service
```

## Local

From **repo root**:

```bash
cp packages/socket-server/.env.example packages/socket-server/.env
# Match SOCKET_EMIT_SECRET with root .env (see root .env.example)

npm run socket:dev   # :3001
npm run dev          # :3000 — widget + /admin/support
```

Health: `http://localhost:3001/health`

| Script | |
|--------|--|
| `npm run socket:dev` | Dev |
| `npm run socket` | Start |
| `npm run test:socket` | Tests |

## Env (this service only)

| Variable | |
|----------|--|
| `PORT` | Default `3001` (Railway sets this) |
| `CORS_ORIGIN` | Next origin (`http://localhost:3000` or your Vercel URL) |
| `SOCKET_EMIT_SECRET` | Bearer for `/emit` (same as Next) |

Next also needs `NEXT_PUBLIC_SOCKET_URL` + `SOCKET_SERVER_URL` pointing at this service.

## Railway

Start command: `npm run start -w niva-cart-socket`  
Vars: `CORS_ORIGIN`, `SOCKET_EMIT_SECRET` → generate a public domain → set that URL on Vercel.

## API

- `GET /health` → `200`
- `POST /emit` + `Authorization: Bearer <secret>` → `204`  
  Body: `{ chatId, message }`
