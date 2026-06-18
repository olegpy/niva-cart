'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const publicLinks = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/support', label: 'Support' },
] as const;

const adminLinks = [
  { href: '/admin/users', label: 'Users' },
] as const;

function isLinkActive(pathname: string, href: string, exact?: boolean): boolean {
  return exact ? pathname === href : pathname.startsWith(href);
}

function NavLink({
  href,
  label,
  exact,
}: {
  href: string;
  label: string;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const active = isLinkActive(pathname, href, exact);

  return (
    <Link
      href={href}
      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-red-600 text-red-600'
          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
      }`}
    >
      {label}
    </Link>
  );
}

export default function AdminNav() {
  return (
    <nav className="flex items-center justify-between border-t border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-1">
        {publicLinks.map((link) => (
          <NavLink key={link.href} href={link.href} label={link.label} exact={'exact' in link ? link.exact : undefined} />
        ))}
      </div>

      <div className="flex items-center gap-1">
        {adminLinks.map(({ href, label }) => (
          <NavLink key={href} href={href} label={label} />
        ))}
      </div>
    </nav>
  );
}
