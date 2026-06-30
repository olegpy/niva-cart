'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/shared/components/ui/button';

export default function LogoutButton() {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      Logout
    </Button>
  );
}
