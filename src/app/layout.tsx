import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/features/admin/auth/components/AuthProvider";

export const metadata: Metadata = {
  title: "Niva Cart | E-commerce Store",
  description: "A simple e-commerce application built with Next.js, TypeScript, and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className="font-sans antialiased">
          <AuthProvider>{children}</AuthProvider>
        </body>
    </html>
  );
}
