import Header from "@/shared/components/Header";
import { CartProvider } from "@/features/cart/context/CartContext";
import SupportWidget from "@/features/support/components/SupportWidget";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Header />
      <main className="container mx-auto px-4 py-8 pt-20">
        {children}
      </main>
      <SupportWidget />
    </CartProvider>
  );
}
