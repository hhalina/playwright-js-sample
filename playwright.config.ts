import { defineConfig } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  workers: 6,
  retries: 1,
  timeout: 40 * 1000,
  fullyParallel: true,
  testDir: 'tests',
  expect: {
    timeout: 5000,
  },
  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: false,
      },
    ],
  ],
  use: {
    ignoreHTTPSErrors: true,
    baseURL: process.env.BASE_URL,
    viewport: {
      width: process.env.WIDTH ? parseInt(process.env.WIDTH) : 1920,
      height: process.env.HEIGHT ? parseInt(process.env.HEIGHT) : 1080,
    },
    headless: true,
    testIdAttribute: 'data-qa',
    screenshot: { mode: 'only-on-failure', fullPage: true },
    trace: 'on-first-retry',
    actionTimeout: 10 * 1000,
  },
  projects: [
    {
      name: 'chrome',
      use: {
        browserName: 'chromium',
        permissions: ['clipboard-read'],
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
      },
    },
    {
      name: 'safari',
      use: {
        browserName: 'webkit',
      },
    },
  ],
});
