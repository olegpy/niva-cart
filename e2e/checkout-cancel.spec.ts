import { expect, test, type Page } from '@playwright/test';

import { headerCartLink } from './helpers';

const productTitles = ['E2E Alpha Item', 'E2E Beta Item'];

function productCard(page: Page, title: string) {
  return page
    .locator('.rounded-lg.shadow-md')
    .filter({ has: page.getByRole('heading', { level: 3, name: title }) });
}

async function addToCart(page: Page, title: string) {
  await productCard(page, title).getByRole('button', { name: 'Add to Cart' }).click();
}

test.describe('checkout cancel', () => {
  test('cancel page renders with a back-to-cart link', async ({ page }) => {
    await page.goto('/checkout/cancel');

    await expect(
      page.getByRole('heading', { name: /checkout cancelled/i }),
    ).toBeVisible();
    const backLink = page.getByRole('link', { name: /back to cart/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/cart');
  });

  test('cart items survive navigation to the cancel page and back', async ({
    page,
  }) => {
    await page.goto('/');
    for (const title of productTitles) {
      await addToCart(page, title);
    }
    await expect(headerCartLink(page)).toContainText('2 items');

    await headerCartLink(page).click();
    await expect(page).toHaveURL(/\/cart$/);
    for (const title of productTitles) {
      await expect(
        page.locator('main').getByRole('heading', { name: title }),
      ).toBeVisible();
    }

    await page.goto('/checkout/cancel');
    await expect(
      page.getByRole('heading', { name: /checkout cancelled/i }),
    ).toBeVisible();

    await page.getByRole('link', { name: /back to cart/i }).click();
    await expect(page).toHaveURL(/\/cart$/);
    for (const title of productTitles) {
      await expect(
        page.locator('main').getByRole('heading', { name: title }),
      ).toBeVisible();
    }
  });
});
