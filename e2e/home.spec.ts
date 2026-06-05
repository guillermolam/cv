import { expect, test } from '@playwright/test';

const viewports = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  wide: { width: 1920, height: 1080 },
};

test.describe('Portfolio UI', () => {
  test('home page renders', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Guillermo');
    await expect(page.getByRole('banner')).toContainText('Guillermo Lam Martín');
    await expect(page.getByRole('main')).toContainText('Cloud Security');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'Whoami', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('navigation works across pages', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });

    await nav.getByRole('link', { name: 'Toolchain', exact: true }).click();
    await expect(page).toHaveURL('/en/toolchain');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Toolchain');

    await nav.getByRole('link', { name: 'Knowledge Center', exact: true }).click();
    await expect(page).toHaveURL('/en/knowledge');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Knowledge Center');

    await nav.getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page).toHaveURL('/en/contact');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Contact');
  });

  test('home CTA buttons navigate correctly', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/');

    await page.getByRole('main').getByRole('link', { name: 'Briefing Pack', exact: true }).click();
    await expect(page).toHaveURL('/en/cv');

    await page.goto('/');
    await page.getByRole('main').getByRole('link', { name: 'Experience', exact: true }).click();
    await expect(page).toHaveURL(/#experience-summary$/);

    await page.goto('/');
    await page.getByRole('main').getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page).toHaveURL('/en/contact');
  });

  for (const [label, viewport] of Object.entries(viewports)) {
    test(`${label} layout smoke`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.goto('/');

      const nav = page.getByRole('navigation', { name: 'Primary' });
      await expect(nav).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Whoami', exact: true })).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Toolchain', exact: true })).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Experience', exact: true })).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Tutorials', exact: true })).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Knowledge Center', exact: true })).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();

      await expect(page.getByRole('heading', { level: 1 })).toContainText('Guillermo');

      await testInfo.attach(`home-${label}.png`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });
  }
});
