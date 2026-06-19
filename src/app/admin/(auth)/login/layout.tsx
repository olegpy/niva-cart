import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Login | Niva Cart",
  description: "Sign in to the Niva Cart admin panel",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-100 px-4">
      <div className="mx-auto w-full max-w-sm pt-[15vh]">
        <Link href="/" className="mb-4 block text-center text-2xl font-bold text-gray-900">
          Niva Cart
        </Link>
        {children}
      </div>
    </div>
  );
}
