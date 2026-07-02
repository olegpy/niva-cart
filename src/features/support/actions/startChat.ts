'use server';

export type StartChatState = {
  error?: string;
  success?: boolean;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function startChatAction(
  _prevState: StartChatState,
  formData: FormData,
): Promise<StartChatState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const question = String(formData.get('question') ?? '').trim();

  if (!name) {
    return { error: 'Please enter your name.' };
  }

  if (!email) {
    return { error: 'Please enter your email.' };
  }

  if (!isValidEmail(email)) {
    return { error: 'Please enter a valid email address.' };
  }

  if (!question) {
    return { error: 'Please enter your question.' };
  }

  // TODO: create SupportThread + first message in DB
  return { success: true };
}
