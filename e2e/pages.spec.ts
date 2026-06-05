import { expect, test } from '@playwright/test';

const pages = [
  { path: '/', heading: 'Guillermo' },
  { path: '/about', heading: 'About' },
  { path: '/cv', heading: 'CV' },
  { path: '/contact', heading: 'Contact' },
  { path: '/test/model-meshy', heading: 'Model Viewer Test', waitForStatusText: 'Loaded:' },
];

test.describe('Static pages', () => {
  for (const p of pages) {
    test(`${p.path} loads without console errors`, async ({ page }, testInfo) => {
      const consoleErrors: string[] = [];
      const missingResources: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('response', (resp) => {
        if (resp.status() !== 404) return;
        const url = resp.url();
        if (!url.startsWith('http://localhost:4321')) return;
        missingResources.push(url.replace('http://localhost:4321', ''));
      });

      const resp = await page.goto(p.path);
      expect(resp?.status(), `Unexpected status code for ${p.path}`).toBeLessThan(400);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(p.heading);

      if (p.waitForStatusText) {
        await expect(page.locator('#mv-status')).toContainText(p.waitForStatusText, {
          timeout: 15000,
        });
      }

      try {
        await testInfo.attach(`${p.path.replaceAll('/', '_') || 'home'}.png`, {
          body: await page.screenshot({ fullPage: false }),
          contentType: 'image/png',
        });
      } catch {}

      expect(
        missingResources,
        `Missing resources detected on ${p.path}: ${missingResources.join(' | ')}`,
      ).toEqual([]);
      expect(
        consoleErrors,
        `Console errors detected on ${p.path}: ${consoleErrors.join(' | ')}`,
      ).toEqual([]);
    });
  }
});
