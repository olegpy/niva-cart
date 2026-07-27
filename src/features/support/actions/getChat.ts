'use server';

import { serializeChat } from '@/features/support/lib/serialise';
import type { SupportChat } from '@/features/support/types';
import { prisma } from '@/shared/lib/prisma';

export async function getChatAction(chatId: string): Promise<SupportChat | null> {
    if (!chatId) {
        return null;
    }

    const chat = await prisma.supportChat.findUnique({
        where: {
            id: chatId,
        },
        include: {
            messages: {
                orderBy: { createdAt: 'asc' },
            },
        }
    });

    if (!chat) {
        return null;
    }

    return serializeChat(chat);
}