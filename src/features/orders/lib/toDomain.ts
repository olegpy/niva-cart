import type { Order as PrismaOrder, OrderItem as PrismaOrderItem } from '@prisma/client';
import type { Order, OrderItem } from '@/features/orders/types';

export type OrderRow = PrismaOrder & { items: PrismaOrderItem[] };

export function toDomain(row: OrderRow): Order {
  const items: OrderItem[] = row.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    titleSnapshot: item.titleSnapshot,
    unitPrice: item.price / 100,
    quantity: item.quantity,
  }));

  return {
    id: row.id,
    userId: row.userId,
    stripeSessionId: row.stripeSessionId,
    stripePaymentIntentId: row.stripePaymentIntentId,
    status: row.status,
    total: row.total / 100,
    currency: row.currency,
    customerEmail: row.customerEmail,
    items,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
