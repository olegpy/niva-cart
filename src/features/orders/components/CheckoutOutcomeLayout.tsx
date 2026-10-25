import Link from 'next/link';
import type { ReactNode } from 'react';

const ACTION_LINK_CLASS =
  'inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2';

export function CheckoutOutcomeLayout({
  title,
  link,
  children,
}: {
  title: string;
  link: { href: string; label: string };
  children: ReactNode;
}) {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{title}</h1>
      {children}
      <div className="mt-6 flex justify-center">
        <Link href={link.href} className={ACTION_LINK_CLASS}>
          {link.label}
        </Link>
      </div>
    </>
  );
}
