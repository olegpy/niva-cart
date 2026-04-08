import { expect, test, type Page } from '@playwright/test';

import mockProducts from './fixtures/mock-products.json';
import { headerCartLink } from './helpers';

function productCard(page: Page, title: string) {
  return page
    .locator('.rounded-lg.shadow-md')
    .filter({ has: page.getByRole('heading', { level: 3, name: title }) });
}

test.describe('catalog', () => {
  test('home shows product list from mocked API', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Products List' })).toBeVisible();
    for (const p of mockProducts) {
      await expect(page.getByRole('heading', { level: 3, name: p.title })).toBeVisible();
    }
  });

  test('each product card has an Add to Cart button', async ({ page }) => {
    await page.goto('/');

    for (const p of mockProducts) {
      const add = productCard(page, p.title).getByRole('button', { name: 'Add to Cart' });
      await expect(add).toBeVisible();
      await expect(add).toBeEnabled();
    }
  });

  test('Add to Cart click runs handler: card shows quantity and header updates', async ({ page }) => {
    await page.goto('/');

    const [alpha, beta] = mockProducts;
    await productCard(page, alpha.title).getByRole('button', { name: 'Add to Cart' }).click();

    await expect(productCard(page, alpha.title)).toContainText('In cart: 1');
    await expect(headerCartLink(page)).toContainText('1 item');
    await expect(headerCartLink(page)).toContainText(`Total: $${alpha.price.toFixed(2)}`);

    await productCard(page, beta.title).getByRole('button', { name: 'Add to Cart' }).click();

    await expect(productCard(page, beta.title)).toContainText('In cart: 1');
    await expect(headerCartLink(page)).toContainText('2 items');
    const sum = alpha.price + beta.price;
    await expect(headerCartLink(page)).toContainText(`Total: $${sum.toFixed(2)}`);
  });
});
