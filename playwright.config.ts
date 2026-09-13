import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  reporter: [['list'], ['html', { open: 'never' }]],
  workers: 2,
  use: {
    baseURL: 'http://127.0.0.1:4381/cv/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command:
      'pnpm exec astro preview --host 127.0.0.1 --port 4381 --verbose --ignore-lock',
    url: 'http://127.0.0.1:4381/cv/',
    // Keep Astro in the foreground even when invoked by an agent.
    env: { ASTRO_PREVIEW_BACKGROUND: '0' },
    timeout: 120000,
    reuseExistingServer: false,
  },
});
