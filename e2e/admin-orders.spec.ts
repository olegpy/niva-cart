import { expect, test } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

import { deleteOrdersBySession, seedPaidOrder, signInAsAdmin } from './helpers';

const CUSTOMER_EMAIL = 'admin-orders-e2e-customer@niva-cart.local';
const CUSTOMER_ID = 'admin_orders_e2e_customer';

test.describe('admin orders', () => {
  test('admin sees seeded customer order on /admin/orders', async ({ page }) => {
    const prisma = new PrismaClient();
    const sessionId = `cs_admin_e2e_${Date.now()}`;

    try {
      await prisma.user.upsert({
        where: { id: CUSTOMER_ID },
        update: { email: CUSTOMER_EMAIL, name: 'Admin Orders Customer' },
        create: {
          id: CUSTOMER_ID,
          email: CUSTOMER_EMAIL,
          name: 'Admin Orders Customer',
        },
      });

      const alpha = await prisma.product.findUniqueOrThrow({ where: { id: 1 } });

      await seedPaidOrder(prisma, {
        userId: CUSTOMER_ID,
        stripeSessionId: sessionId,
        customerEmail: CUSTOMER_EMAIL,
        productId: alpha.id,
        titleSnapshot: alpha.title,
        price: alpha.price,
        total: 4299,
      });

      await signInAsAdmin(page);

      await page.goto('/admin/orders');
      await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();

      const row = page.getByRole('row').filter({ hasText: CUSTOMER_EMAIL });
      await expect(row).toBeVisible();
      await expect(row).toContainText('$42.99');
      await expect(row).toContainText(/paid/i);
    } finally {
      await deleteOrdersBySession(prisma, sessionId);
      await prisma.user.deleteMany({ where: { id: CUSTOMER_ID } });
      await prisma.$disconnect();
    }
  });

  test('user filter narrows orders to the selected customer', async ({
    page,
  }) => {
    const prisma = new PrismaClient();
    const runId = Date.now();
    const customers = [
      {
        id: `admin_orders_e2e_filter_a_${runId}`,
        email: `admin-orders-filter-a-${runId}@niva-cart.local`,
        name: 'Filter Customer A',
        sessionId: `cs_admin_filter_a_${runId}`,
        total: 1111,
      },
      {
        id: `admin_orders_e2e_filter_b_${runId}`,
        email: `admin-orders-filter-b-${runId}@niva-cart.local`,
        name: 'Filter Customer B',
        sessionId: `cs_admin_filter_b_${runId}`,
        total: 2222,
      },
    ] as const;
    const [customerA, customerB] = customers;

    try {
      await prisma.user.createMany({
        data: customers.map((c) => ({ id: c.id, email: c.email, name: c.name })),
      });

      const alpha = await prisma.product.findUniqueOrThrow({ where: { id: 1 } });

      for (const c of customers) {
        await seedPaidOrder(prisma, {
          userId: c.id,
          stripeSessionId: c.sessionId,
          customerEmail: c.email,
          productId: alpha.id,
          titleSnapshot: alpha.title,
          price: alpha.price,
          total: c.total,
        });
      }

      await signInAsAdmin(page);

      await page.goto('/admin/orders');
      await expect(
        page.getByRole('row').filter({ hasText: customerA.email }),
      ).toBeVisible();
      await expect(
        page.getByRole('row').filter({ hasText: customerB.email }),
      ).toBeVisible();

      await page
        .getByLabel('Filter by user')
        .selectOption({ label: `${customerB.email} (customer)` });
      await page.getByRole('button', { name: 'Filter' }).click();

      await expect(page).toHaveURL(
        new RegExp(`/admin/orders\\?userId=${customerB.id}`),
      );
      await expect(
        page.getByRole('row').filter({ hasText: customerB.email }),
      ).toBeVisible();
      await expect(
        page.getByRole('row').filter({ hasText: customerA.email }),
      ).toHaveCount(0);

      await page.getByRole('link', { name: 'Clear filter' }).click();
      await expect(page).toHaveURL(/\/admin\/orders$/);
      await expect(
        page.getByRole('row').filter({ hasText: customerA.email }),
      ).toBeVisible();
    } finally {
      await deleteOrdersBySession(
        prisma,
        customers.map((c) => c.sessionId),
      );
      await prisma.user.deleteMany({
        where: { id: { in: customers.map((c) => c.id) } },
      });
      await prisma.$disconnect();
    }
  });
});
