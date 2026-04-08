import type { Page } from '@playwright/test';

/** Cart navigation link in the fixed header (keeps client-side cart state). */
export function headerCartLink(page: Page) {
  return page.locator('header a[href="/cart"]');
}
