import { expect, test } from '@playwright/test';

const pages = [
  { path: '/', heading: 'Cloud Security & DevSecOps Engineer' },
  { path: '/about', heading: 'About' },
  { path: '/cv', heading: 'CV' },
  { path: '/contact', heading: 'Contact' },
];

test.describe('Static pages', () => {
  for (const p of pages) {
    test(`${p.path} loads without console errors`, async ({ page }, testInfo) => {
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      const resp = await page.goto(p.path);
      expect(resp?.status(), `Unexpected status code for ${p.path}`).toBeLessThan(400);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(p.heading);

      await testInfo.attach(`${p.path.replaceAll('/', '_') || 'home'}.png`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      expect(
        consoleErrors,
        `Console errors detected on ${p.path}: ${consoleErrors.join(' | ')}`,
      ).toEqual([]);
    });
  }
});
