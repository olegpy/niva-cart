import { expect, test, type Page } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

import {
  ADMIN_EMAIL,
  deleteOrdersBySession,
  headerCartLink,
  seedPaidOrder,
  signInAsAdmin,
} from './helpers';

/**
 * Real Stripe is never called from CI. The webhook route is covered by
 * `src/app/api/webhooks/stripe/route.test.ts` with a signed, canned event;
 * here we assert the post-webhook UI by seeding the Order row directly.
 * This spec needs no `STRIPE_WEBHOOK_SECRET` to be set.
 */

function productCard(page: Page, title: string) {
  return page
    .locator('.rounded-lg.shadow-md')
    .filter({ has: page.getByRole('heading', { level: 3, name: title }) });
}

test.describe('checkout happy path', () => {
  test('success page shows a recorded order and clears the cart', async ({
    page,
  }) => {
    const prisma = new PrismaClient();
    const sessionId = `cs_e2e_${Date.now()}`;

    try {
      const admin = await prisma.user.findUniqueOrThrow({
        where: { email: ADMIN_EMAIL },
      });
      const alpha = await prisma.product.findUniqueOrThrow({ where: { id: 1 } });

      await deleteOrdersBySession(prisma, sessionId);

      await signInAsAdmin(page);

      await page.goto('/');
      await productCard(page, alpha.title)
        .getByRole('button', { name: 'Add to Cart' })
        .click();

      await headerCartLink(page).click();
      await expect(page).toHaveURL(/\/cart$/);
      await expect(
        page.locator('main').getByRole('button', { name: /checkout/i }),
      ).toBeEnabled();

      await seedPaidOrder(prisma, {
        userId: admin.id,
        stripeSessionId: sessionId,
        customerEmail: ADMIN_EMAIL,
        productId: alpha.id,
        titleSnapshot: alpha.title,
        price: alpha.price,
      });

      await page.goto(`/checkout/success?session_id=${sessionId}`);
      await expect(page.getByRole('heading', { name: /thank you/i })).toBeVisible();
      await expect(
        page.getByTestId('order-summary').getByText(alpha.title),
      ).toBeVisible();

      await page.goto('/admin/orders');
      await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
      const expectedTotal = (alpha.price / 100).toFixed(2);
      await expect(
        page.locator('main').getByText(`$${expectedTotal}`),
      ).toBeVisible();

      await page.goto('/cart');
      await expect(page.getByText(/your cart is empty/i)).toBeVisible();
    } finally {
      await deleteOrdersBySession(prisma, sessionId);
      await prisma.$disconnect();
    }
  });
});
