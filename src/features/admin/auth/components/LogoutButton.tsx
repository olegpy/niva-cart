'use client';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
    >
      Logout
    </button>
  );
}