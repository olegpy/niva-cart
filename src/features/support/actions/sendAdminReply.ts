'use server';

import { getServerSession } from "next-auth";
import { ActionState, ChatMessage } from "../types";
import { SUPPORT_ROLE } from "@niva/support-realtime";
import { authOptions } from "@/features/admin/auth/lib/auth";
import { UserRole } from "@/features/admin/users/types";
import { actionError, actionSuccess } from "../lib/actionResponses";
import { validateMessageText } from "../lib/validation";
import { prisma } from "@/shared/lib/prisma";
import { serializeMessage } from "../lib/serialise";
import { notifySupportMessage } from "@/features/support/lib/socket/notify";

export type SendAdminReplyState = ActionState<ChatMessage>;

const UNAUTHORIZED_ERROR = 'Unauthorized. You must be an admin to send a reply.';
const CONVERSATION_CLOSED_ERROR = 'The Conversation is closed.';
const CONVERSATION_NOT_FOUND_ERROR = 'Conversation not found.';

export async function sendAdminReplyAction(
    _prevState: SendAdminReplyState,
    formData: FormData,
): Promise<SendAdminReplyState> {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== UserRole.admin) {
        return actionError(UNAUTHORIZED_ERROR);
    }

    const chatId = String(formData.get('chatId') ?? '').trim();
    const text = String(formData.get('text') ?? '').trim();

    const textError = validateMessageText(text);
    
    if (textError) return actionError(textError);
    if (!chatId) return actionError(CONVERSATION_NOT_FOUND_ERROR);

    const chat = await prisma.supportChat.findUnique({
        where: { id: chatId },
        select: { id: true, status: true }
    });

    if (!chat) return actionError(CONVERSATION_NOT_FOUND_ERROR);
    if (chat.status === 'closed') return actionError(CONVERSATION_CLOSED_ERROR);

    const authorName = session.user.name?.trim() ?? 'Support';

    const message = await prisma.$transaction(async (tx) => {
        const created = await tx.chatMessage.create({
            data: {
                chatId,
                text,
                authorName,
                authorRole: SUPPORT_ROLE.ADMIN,
            }
        });

        await tx.supportChat.update({
            where: { id: chatId },
            data: {
                updatedAt: new Date(),
            }
        });

        return created;
    });

    const serialized = serializeMessage(message);
    await notifySupportMessage({ chatId, message: serialized });
    return actionSuccess(serialized);
}
