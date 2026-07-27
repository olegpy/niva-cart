'use client';

import { useEffect } from 'react';
import {
  SUPPORT_EVENTS,
  SUPPORT_ROLE,
  type SupportMessagePayload,
  type SupportRealtimeMessage,
} from '@niva/support-realtime';
import { getSupportSocket } from '@/features/support/lib/socket/client';

/** Listen to all support messages for the admin inbox list. */
export function useAdminInboxSocket(
  onMessage: (message: SupportRealtimeMessage) => void,
) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SOCKET_URL) return;

    const socket = getSupportSocket();

    function handleMessage(payload: SupportMessagePayload) {
      console.log(`[${SUPPORT_EVENTS.MESSAGE}] inbox`, payload);
      onMessage(payload.message);
    }

    function joinInbox() {
      socket.emit(SUPPORT_EVENTS.JOIN, { role: SUPPORT_ROLE.ADMIN });
    }

    socket.on(SUPPORT_EVENTS.MESSAGE, handleMessage);

    if (socket.connected) {
      joinInbox();
    } else {
      socket.once('connect', joinInbox);
      socket.connect();
    }

    return () => {
      socket.off(SUPPORT_EVENTS.MESSAGE, handleMessage);
      socket.off('connect', joinInbox);
    };
  }, [onMessage]);
}
