import { expect, test } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

import { deleteOrdersBySession, seedPaidOrder, signInAsAdmin } from './helpers';

const VICTIM_ID = 'cross_user_victim';
const VICTIM_EMAIL = 'cross-user-victim@niva-cart.local';

test.describe('checkout success — access control', () => {
  test('a signed-in user cannot see another user\'s order via session_id', async ({
    page,
  }) => {
    const prisma = new PrismaClient();
    const sessionId = `cs_cross_user_${Date.now()}`;
    const SECRET_TITLE = `CrossUser Secret ${Date.now()}`;

    try {
      await prisma.user.upsert({
        where: { id: VICTIM_ID },
        update: { email: VICTIM_EMAIL, name: 'Cross-user Victim' },
        create: { id: VICTIM_ID, email: VICTIM_EMAIL, name: 'Cross-user Victim' },
      });

      const alpha = await prisma.product.findUniqueOrThrow({ where: { id: 1 } });

      await seedPaidOrder(prisma, {
        userId: VICTIM_ID,
        stripeSessionId: sessionId,
        customerEmail: VICTIM_EMAIL,
        productId: alpha.id,
        titleSnapshot: SECRET_TITLE,
        price: alpha.price,
      });

      await signInAsAdmin(page);
      await page.goto(`/checkout/success?session_id=${sessionId}`);

      await expect(page.getByTestId('order-summary')).toHaveCount(0);
      await expect(page.locator('main')).not.toContainText(SECRET_TITLE);
      await expect(page.locator('main')).not.toContainText(VICTIM_EMAIL);
    } finally {
      await deleteOrdersBySession(prisma, sessionId);
      await prisma.user.deleteMany({ where: { id: VICTIM_ID } });
      await prisma.$disconnect();
    }
  });

  test('an unauthenticated visitor is redirected away from /checkout/success', async ({
    page,
  }) => {
    await page.goto('/checkout/success?session_id=cs_whatever');

    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByTestId('order-summary')).toHaveCount(0);
  });

  test('an unauthenticated visitor is redirected away from /admin/orders', async ({
    page,
  }) => {
    await page.goto('/admin/orders');

    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
