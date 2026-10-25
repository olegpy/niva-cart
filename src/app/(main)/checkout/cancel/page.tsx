import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">
        Checkout cancelled
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        Your cart is still waiting. You can retry whenever you are ready.
      </p>
      <Link
        href="/cart"
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Back to cart
      </Link>
    </div>
  );
}
