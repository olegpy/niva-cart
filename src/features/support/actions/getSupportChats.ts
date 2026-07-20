'use server';

import { serializeChat } from '@/features/support/lib/serialise';
import type { SupportChat } from '@/features/support/types';
import { prisma } from '@/shared/lib/prisma';

export async function getSupportChatsAction(): Promise<SupportChat[]> {
  const chats = await prisma.supportChat.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  return chats.map(serializeChat);
}
