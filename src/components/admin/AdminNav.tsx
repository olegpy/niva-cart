'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/support', label: 'Support' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 border-t border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
      {links.map((link) => {
        const isActive =
          link.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              isActive
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
