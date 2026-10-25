import 'server-only';
import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';
import { toDomain } from '@/features/orders/lib/toDomain';
import type { Order } from '@/features/orders/types';

const ORDER_LIST_LIMIT = 100;

export const ORDER_SELECT = {
  id: true,
  userId: true,
  stripeSessionId: true,
  stripePaymentIntentId: true,
  status: true,
  total: true,
  currency: true,
  customerEmail: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: {
      id: true,
      orderId: true,
      productId: true,
      titleSnapshot: true,
      price: true,
      quantity: true,
    },
  },
} satisfies Prisma.OrderSelect;

export async function listOrdersForUser(userId: string): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: ORDER_LIST_LIMIT,
    select: ORDER_SELECT,
  });
  return rows.map(toDomain);
}

export async function listAllOrders(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: ORDER_LIST_LIMIT,
    select: ORDER_SELECT,
  });
  return rows.map(toDomain);
}

export async function getOrderByStripeSessionId(
  sessionId: string,
): Promise<Order | null> {
  const row = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
    select: ORDER_SELECT,
  });
  return row ? toDomain(row) : null;
}
