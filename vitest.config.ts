import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
    exclude: [
      'e2e/**',
      'playwright-report/**',
      'test-results/**',
      'node_modules/**',
    ],
  },
});
