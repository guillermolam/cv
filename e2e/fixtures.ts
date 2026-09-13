import { test as base, expect } from '@playwright/test';

export const test = base.extend<{ runtimeDiagnostics: void }>({
  runtimeDiagnostics: [
    async ({ page }, use, testInfo) => {
      const failures: string[] = [];
      const logs: string[] = [];
      // Capture every level, including debug, without suppressing browser output.
      page.on('console', (message) => {
        logs.push(`[${message.type()}] ${message.text()}`);
        if (['warning', 'error'].includes(message.type()))
          failures.push(logs.at(-1)!);
      });
      page.on('pageerror', (error) =>
        failures.push(error.stack ?? error.message),
      );
      page.on('response', (response) => {
        if (response.status() >= 400)
          failures.push(`${response.status()} ${response.url()}`);
      });
      await use();
      await testInfo.attach('browser-debug.log', {
        body: logs.join('\n'),
        contentType: 'text/plain',
      });
      expect(
        failures,
        'Browser warnings, errors, exceptions, and HTTP failures',
      ).toEqual([]);
    },
    { auto: true },
  ],
});
export { expect };
