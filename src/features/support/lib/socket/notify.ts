import type { SupportMessagePayload } from '@niva/support-realtime';

export async function notifySupportMessage(
  payload: SupportMessagePayload,
): Promise<void> {
  const baseUrl = process.env.SOCKET_SERVER_URL;
  if (!baseUrl) return;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const secret = process.env.SOCKET_EMIT_SECRET;
  if (secret) {
    headers.Authorization = `Bearer ${secret}`;
  }

  try {
    const response = await fetch(`${baseUrl}/emit`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('[support] socket notify failed', response.status);
    }
  } catch (error) {
    console.error('[support] socket notify failed', error);
  }
}
