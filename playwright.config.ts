import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',

  timeout: 30_000,
  expect: { timeout: 10_000 },

  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,

  use: {
    baseURL: 'https://app.ab-payments.ru',
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Запускается ТОЛЬКО вручную, когда тебе нужно пересоздать storageState.json
    {
      name: 'setup',
      testMatch: /auth\.setup\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        headless: false, // нужен UI для ручного ввода OTP
      },
    },

    // Обычные тесты (без setup)
    {
      name: 'chromium',
      testMatch: /.*\.spec\.ts/,
      testIgnore: /auth\.setup\.spec\.ts/,   // ✅ игнор только тут
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'storageState.json',
      },
    },
  ],

  reporter: [['html', { open: 'never' }]],
});