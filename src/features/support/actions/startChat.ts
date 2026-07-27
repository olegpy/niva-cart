'use server';

import { serializeChat } from '@/features/support/lib/serialise';
import { isValidEmail } from '@/features/support/lib/validation';
import type { ActionState, SupportChat } from '@/features/support/types';
import { SUPPORT_ROLE } from '@niva/support-realtime';
import { prisma } from '@/shared/lib/prisma';
import { actionError, actionSuccess } from '../lib/actionResponses';
import { notifySupportMessage } from '@/features/support/lib/socket/notify';

export type StartChatState = ActionState<SupportChat>;

export async function startChatAction(
  _prevState: StartChatState,
  formData: FormData,
): Promise<StartChatState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const question = String(formData.get('question') ?? '').trim();

  if (!name) {
    return actionError('Please enter your name.');
  }

  if (!email) {
    return actionError('Please enter your email.');
  }

  if (!isValidEmail(email)) {
    return actionError('Please enter a valid email address.');
  }

  if (!question) {
    return actionError('Please enter your question.');
  }

  const chat = await prisma.supportChat.create({
    data: {
      name,
      email,
      messages: {
        create: {
          authorRole: SUPPORT_ROLE.CUSTOMER,
          authorName: name,
          text: question,
        },
      },
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  const serialized = serializeChat(chat);
  const firstMessage = serialized.messages[0];
  if (firstMessage) {
    await notifySupportMessage({ chatId: serialized.id, message: firstMessage });
  }

  return actionSuccess(serialized);
}
