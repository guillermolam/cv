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
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Cloud Security & DevSecOps Engineer',
    );
    await expect(page.getByRole('main')).toContainText('Guillermo Lam Martín');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('navigation works across pages', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });

    await nav.getByRole('link', { name: 'About', exact: true }).click();
    await expect(page).toHaveURL('/about');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('About');

    await nav.getByRole('link', { name: 'CV', exact: true }).click();
    await expect(page).toHaveURL('/cv');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('CV');

    await nav.getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page).toHaveURL('/contact');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Contact');
  });

  test('home CTA buttons navigate correctly', async ({ page }) => {
    await page.goto('/');

    await page.locator('.hero-ctas').getByRole('link', { name: 'Download CV' }).click();
    await expect(page).toHaveURL('/cv');

    await page.getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'Home', exact: true })
      .click();
    await page.locator('.hero-ctas').getByRole('link', { name: 'View portfolio' }).click();
    await expect(page).toHaveURL('/portfolio');

    await page.getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'Home', exact: true })
      .click();
    await page.locator('.hero-ctas').getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page).toHaveURL('/contact');
  });

  for (const [label, viewport] of Object.entries(viewports)) {
    test(`${label} layout smoke`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.goto('/');

      const nav = page.getByRole('navigation', { name: 'Primary' });
      await expect(nav).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
      await expect(nav.getByRole('link', { name: 'About', exact: true })).toBeVisible();
      await expect(nav.getByRole('link', { name: 'CV', exact: true })).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();

      await expect(page.getByRole('heading', { level: 1 })).toContainText(
        'Cloud Security & DevSecOps Engineer',
      );

      await testInfo.attach(`home-${label}.png`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });
  }
});
