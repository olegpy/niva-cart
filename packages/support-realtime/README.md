# @niva/support-realtime

Shared Socket.IO **event names + payload types** (no server logic).

```text
packages/
  support-realtime/   ← this package (protocol)
  socket-server/      ← Socket.IO microservice (logic)
```

```ts
import { SUPPORT_EVENTS, type SupportMessagePayload } from '@niva/support-realtime';
```
