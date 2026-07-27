'use client';

import { useEffect } from 'react';
import {
  SUPPORT_EVENTS,
  type SupportMessagePayload,
  type SupportRealtimeMessage,
  type SupportRole,
} from '@niva/support-realtime';
import { getSupportSocket } from '@/features/support/lib/socket/client';

type Options = {
  chatId: string | null;
  role: SupportRole;
  onMessage: (message: SupportRealtimeMessage) => void;
};

export function useSupportSocket({ chatId, role, onMessage }: Options) {
  useEffect(() => {
    if (!chatId || !process.env.NEXT_PUBLIC_SOCKET_URL) return;

    const socket = getSupportSocket();

    function handleMessage(payload: SupportMessagePayload) {
      console.log(`[${SUPPORT_EVENTS.MESSAGE}]`, payload);
      if (payload.chatId !== chatId) return;
      onMessage(payload.message);
    }

    function joinRoom() {
      socket.emit(SUPPORT_EVENTS.JOIN, { chatId, role });
    }

    socket.on(SUPPORT_EVENTS.MESSAGE, handleMessage);

    if (socket.connected) {
      joinRoom();
    } else {
      socket.once('connect', joinRoom);
      socket.connect();
    }

    return () => {
      socket.off(SUPPORT_EVENTS.MESSAGE, handleMessage);
      socket.off('connect', joinRoom);
    };
  }, [chatId, role, onMessage]);
}
