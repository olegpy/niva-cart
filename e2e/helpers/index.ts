import { expect, type Page } from '@playwright/test';
import type { PrismaClient } from '@prisma/client';

/** Cart navigation link in the fixed header (keeps client-side cart state). */
export function headerCartLink(page: Page) {
  return page.locator('header a[href="/cart"]');
}

export const ADMIN_EMAIL = 'admin@niva-cart.local';
export const ADMIN_PASSWORD = 'admin123';

export async function signInAsAdmin(page: Page) {
  await page.goto('/admin/login');
  await page.getByLabel('Email').fill(ADMIN_EMAIL);
  await page.getByLabel('Password').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

export type SeedPaidOrderArgs = {
  userId: string;
  stripeSessionId: string;
  customerEmail: string;
  productId: number;
  titleSnapshot: string;
  price: number;
  quantity?: number;
  total?: number;
};

export function seedPaidOrder(prisma: PrismaClient, args: SeedPaidOrderArgs) {
  const quantity = args.quantity ?? 1;
  const total = args.total ?? args.price * quantity;
  return prisma.order.create({
    data: {
      userId: args.userId,
      stripeSessionId: args.stripeSessionId,
      stripePaymentIntentId: `pi_${args.stripeSessionId}`,
      status: 'paid',
      total,
      currency: 'usd',
      customerEmail: args.customerEmail,
      items: {
        create: [
          {
            productId: args.productId,
            titleSnapshot: args.titleSnapshot,
            price: args.price,
            quantity,
          },
        ],
      },
    },
  });
}

export async function deleteOrdersBySession(
  prisma: PrismaClient,
  stripeSessionId: string | string[],
): Promise<void> {
  const where = Array.isArray(stripeSessionId)
    ? { stripeSessionId: { in: stripeSessionId } }
    : { stripeSessionId };
  await prisma.orderItem.deleteMany({ where: { order: where } });
  await prisma.order.deleteMany({ where });
}
