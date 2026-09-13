import { expect, test } from './fixtures';

const viewports = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  wide: { width: 1920, height: 1080 },
};
const runtimeRoute = (route: string) =>
  process.env.CI ? `${route}?no3d=1` : route;

test.describe('Portfolio UI', () => {
  test('home page renders', async ({ page }) => {
    await page.goto(runtimeRoute('./'));
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Guillermo',
    );
    await expect(page.getByRole('banner')).toContainText(
      'Guillermo Lam Martín',
    );
    await expect(page.getByRole('main')).toContainText('Cloud Security');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(
      nav.getByRole('link', { name: 'Whoami', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
  });

  test('navigation works across pages', async ({ page }) => {
    await page.goto(runtimeRoute('./'));
    const nav = page.getByRole('navigation', { name: 'Primary' });

    await nav.getByRole('link', { name: 'Toolchain', exact: true }).click();
    await expect(page).toHaveURL('/cv/en/toolchain');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Toolchain',
    );

    await nav
      .getByRole('link', { name: 'Knowledge Center', exact: true })
      .click();
    await expect(page).toHaveURL('/cv/en/knowledge');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Knowledge Center',
    );

    await nav.getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page).toHaveURL('/cv/en/contact');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Contact');
  });

  test('operator modules, badges, and audio respond to interaction', async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.goto(runtimeRoute('./'));
    const modules = page.getByRole('navigation', { name: 'Operator modules' });
    for (const [id, label] of Object.entries({
      skills: 'Skills',
      certifications: 'Certs',
      education: 'Education',
      languages: 'Languages',
      experience: 'Experience',
      bio: 'Bio',
    })) {
      const button = modules.getByRole('button', { name: label, exact: true });
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(
        page.locator(`.core-view[x-show="is('${id}')"]`),
      ).toBeVisible();
    }
    const audio = page.getByRole('button', {
      name: 'Toggle control room audio',
    });
    const previous = await audio.getAttribute('aria-pressed');
    await audio.click();
    await expect(audio).not.toHaveAttribute(
      'aria-pressed',
      previous ?? 'false',
    );
    await audio.click();
    await page
      .getByRole('button', { name: 'Show DevSecOps', exact: true })
      .click();
    await expect(
      page.getByRole('heading', { name: 'DevSecOps', exact: true }),
    ).toBeVisible();
  });

  test('language navigation keeps the deployment base and current route', async ({
    page,
  }) => {
    await page.goto(runtimeRoute('./en/toolchain'));
    await page
      .getByRole('link', { name: 'Next language (Español)', exact: true })
      .first()
      .click();
    await expect(page).toHaveURL('/cv/es/toolchain');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });

  for (const [label, viewport] of Object.entries(viewports)) {
    test(`${label} layout smoke`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.goto(runtimeRoute('./'));

      const nav = page.getByRole('navigation', { name: 'Primary' });
      await expect(nav).toBeVisible();
      await expect(
        nav.getByRole('link', { name: 'Whoami', exact: true }),
      ).toBeVisible();
      await expect(
        nav.getByRole('link', { name: 'Toolchain', exact: true }),
      ).toBeVisible();
      await expect(
        nav.getByRole('link', { name: 'Experience', exact: true }),
      ).toBeVisible();
      await expect(
        nav.getByRole('link', { name: 'Tutorials', exact: true }),
      ).toBeVisible();
      await expect(
        nav.getByRole('link', { name: 'Knowledge Center', exact: true }),
      ).toBeVisible();
      await expect(
        nav.getByRole('link', { name: 'Contact', exact: true }),
      ).toBeVisible();

      await expect(page.getByRole('heading', { level: 1 })).toContainText(
        'Guillermo',
      );

      await testInfo.attach(`home-${label}.png`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });
  }
});
