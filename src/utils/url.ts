import { headers } from 'next/headers';

export async function getBaseUrl(): Promise<string> {
  // For Vercel deployments (both preview and production)
  if (process.env.VERCEL_URL) {
    const url = `https://${process.env.VERCEL_URL}`;
    return url;
  }

  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const localUrl = `http://${host}`;
  return localUrl;
} 