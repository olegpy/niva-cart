# @niva/support-realtime

Shared Socket.IO **event names + payload types** for support chat. No server process — imported by the Next.js app and by `niva-cart-socket`.

```text
packages/
  support-realtime/   ← this package (protocol)
  socket-server/      ← Socket.IO microservice (logic)
```

```ts
import {
  SUPPORT_EVENTS,
  SUPPORT_ROLE,
  ADMIN_INBOX_ROOM,
  type SupportMessagePayload,
} from '@niva/support-realtime';
```

| Export | Purpose |
|--------|---------|
| `SUPPORT_EVENTS.JOIN` / `MESSAGE` | `support:join`, `support:message` |
| `SUPPORT_ROLE` | `customer` \| `admin` |
| `ADMIN_INBOX_ROOM` | Room name for admin inbox list updates |
| `SupportRealtimeMessage` / payloads | Shared message shape |

How realtime fits the app, local try-out, and Railway deploy: see [`../socket-server/README.md`](../socket-server/README.md) and the root [README](../../README.md#support-chat-socketio).
