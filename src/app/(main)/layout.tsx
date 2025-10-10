import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";

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
    </CartProvider>
  );
}
