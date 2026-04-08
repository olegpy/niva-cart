import { expect, test, type Page } from '@playwright/test';

import { headerCartLink } from './helpers';

function productCard(page: Page, title: string) {
  return page
    .locator('.rounded-lg.shadow-md')
    .filter({ has: page.getByRole('heading', { level: 3, name: title }) });
}

async function addToCartFromHome(page: Page, title: string) {
  await productCard(page, title).getByRole('button', { name: 'Add to Cart' }).click();
}

/** Full `page.goto('/cart')` remounts the app and clears client cart state; use client navigation. */
async function openCartFromHeader(page: Page) {
  await headerCartLink(page).click();
  await expect(page).toHaveURL(/\/cart$/);
  // Header cart hover panel can stay under the cursor and cover `main`, blocking clicks on line actions.
  await page.mouse.move(32, 420);
}

const productTitles = ['E2E Alpha Item', 'E2E Beta Item'];

test.describe('cart', () => {
  test('adding from home shows line item and total on /cart', async ({ page }) => {
    await page.goto('/');
    await addToCartFromHome(page, productTitles[0]);
    await openCartFromHeader(page);

    await expect(page.locator('main').getByRole('heading', { name: productTitles[0] })).toBeVisible();
    await expect(page.locator('main').getByTestId('item-total')).toHaveText('$10.00');
    await expect(page.locator('main').getByTestId('cart-summary-container')).toContainText('Total: $10.00');
  });

  test('multiple items: cart total is sum of line totals', async ({ page }) => {
    await page.goto('/');
    for (const title of productTitles) {
      await addToCartFromHome(page, title);
    }
    await openCartFromHeader(page);

    await expect(page.locator('main').getByTestId('cart-summary-container')).toContainText('Total: $35.50');
  });

  test('remove updates lines and grand total', async ({ page }) => {
    await page.goto('/');
    for (const title of productTitles) {
      await addToCartFromHome(page, title);
    }
    await openCartFromHeader(page);

    await expect(page.locator('main').getByRole('heading', { name: productTitles[1] })).toBeVisible();

    await page.locator('main').getByRole('button', { name: 'Remove item from cart' }).nth(1).click();

    await expect(page.locator('main').getByRole('heading', { name: productTitles[1] })).toHaveCount(0);
    await expect(page.locator('main').getByRole('heading', { name: productTitles[0] })).toBeVisible();
    await expect(page.locator('main').getByTestId('cart-summary-container')).toContainText('Total: $10.00');

    await page.locator('main').getByRole('button', { name: 'Remove item from cart' }).click();

    await expect(page.getByText('Your cart is empty')).toBeVisible();
  });

  test('increment quantity updates line total and cart total', async ({ page }) => {
    await page.goto('/');
    await addToCartFromHome(page, productTitles[0]);
    await openCartFromHeader(page);

    await page.locator('main').getByRole('button', { name: 'Increase quantity' }).click();

    await expect(page.locator('main').getByTestId('item-quantity')).toHaveText('2');
    await expect(page.locator('main').getByTestId('item-total').first()).toHaveText('$20.00');
    await expect(page.locator('main').getByTestId('cart-summary-container')).toContainText('Total: $20.00');
  });
});
