'use server';

import { authenticate } from '@/features/admin/auth/lib/authenticate';
import { encode } from 'next-auth/jwt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type LoginState = {
  error?: string;
};

function getSessionCookieConfig() {
    const useSecureCookies = (process.env.NEXTAUTH_URL ?? '').startsWith('https://');
    const prefix = useSecureCookies ? '__Secure-' : '';
    return {
      name: `${prefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: useSecureCookies,
      },
    };
}

async function setSessionCookie(
  user: NonNullable<Awaited<ReturnType<typeof authenticate>>>,
) {
  const { name, options } = getSessionCookieConfig();

  const token = await encode({
    token: {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    secret: process.env.NEXTAUTH_SECRET!,
  });

  const cookieStore = await cookies();
  
  cookieStore.set(name, token, options);
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  const user = await authenticate(email, password);

  if (!user) {
    return { error: 'Invalid email or password' };
  }

  await setSessionCookie(user);
  redirect('/admin');
}
