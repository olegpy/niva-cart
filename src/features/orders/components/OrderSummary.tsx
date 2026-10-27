import type { Order } from '@/features/orders/types';
import { formatCurrency } from '@/shared/lib/formatCurrency';

export function OrderSummary({ order }: { order: Order }) {
  return (
    <div
      data-testid="order-summary"
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-gray-900">
        Order #{order.id.slice(0, 8)}
      </h2>
      <p className="mt-1 text-sm text-gray-600 capitalize">
        Status: {order.status}
      </p>
      <ul className="mt-4 divide-y divide-gray-200">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {item.titleSnapshot}
              </p>
              <p className="text-sm text-gray-600">
                {item.quantity} × {formatCurrency(item.unitPrice, order.currency)}
              </p>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(item.unitPrice * item.quantity, order.currency)}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
        <span className="text-base font-semibold text-gray-900">Total</span>
        <span className="text-base font-semibold text-gray-900">
          {formatCurrency(order.total, order.currency)}
        </span>
      </div>
    </div>
  );
}
