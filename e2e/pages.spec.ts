import { readdirSync } from 'node:fs';
import { test, expect } from './fixtures';

// The production build is the source of truth, including localized and dynamic pages.
const routes = readdirSync('dist', { recursive: true, encoding: 'utf8' })
  .filter((file) => file.endsWith('index.html'))
  .map((file) => './' + file.replace(/index\.html$/, ''))
  .sort();
if (!routes.length)
  throw new Error('Build the application before running production E2E tests.');

for (const route of routes) {
  test(`${route} production route`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main')).toBeVisible();
    await expect(page).toHaveTitle(/\S/);
    // Trigger below-the-fold lazy charts and client components.
    await page.evaluate(async () => {
      for (
        let y = 0;
        y < document.documentElement.scrollHeight;
        y += innerHeight
      ) {
        scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 80));
      }
    });
    if (route.includes('model-meshy')) {
      await expect(page.locator('#mv-status')).toContainText('Loaded:', {
        timeout: 20000,
      });
    }
    await page.waitForTimeout(500);
  });
}
