'use server';

import { serializeMessage } from '@/features/support/lib/serialise';
import { validateMessageText } from '@/features/support/lib/validation';
import type { ActionState, ChatMessage } from '@/features/support/types';
import { prisma } from '@/shared/lib/prisma';
import { actionError, actionSuccess } from '../lib/actionResponses';

const CHAT_SESSION_NOT_FOUND_ERROR = 'Chat session not found. Please start a new conversation.';

export type SendMessageState = ActionState<ChatMessage>

export async function sendMessageAction(
    _prevState: SendMessageState,
    formData: FormData,
): Promise<SendMessageState> {
    const chatId = String(formData.get('chatId') ?? '').trim();
    const text = String(formData.get('text') ?? '').trim();
    const authorName = String(formData.get('authorName') ?? 'You').trim();

    const textError = validateMessageText(text);
    if (textError) {
        return actionError(textError);
    }

    if (!chatId) {
        return actionError(CHAT_SESSION_NOT_FOUND_ERROR);
    }

    const chat = await prisma.supportChat.findUnique({
        where: { id: chatId },
        select: { id: true, status: true }
    });

    if (!chat) {
        return actionError(CHAT_SESSION_NOT_FOUND_ERROR);
    }
    
    if (chat.status === 'closed') {
        return actionError('This conversation is closed.');
    }

    const message = await prisma.$transaction(async (tx) => {
        const created = await tx.chatMessage.create({
            data: {
                chatId,
                authorRole: 'customer',
                authorName: authorName || 'You',
                text,
            },
        });

        await tx.supportChat.update({
            where: { id: chatId },
            data: { updatedAt: new Date() },
        });

        return created;
    });

    return actionSuccess(serializeMessage(message));
}