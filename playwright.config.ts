import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src',
  /* Maximum time one test can run for. */
  timeout: 90000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-report' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: process.env.BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Record video only on failure. */
    video: 'on-first-retry',
    /* Capture screenshot on failure. */
    screenshot: 'only-on-failure',
    /* Set default timeouts for actions and navigation */
    actionTimeout: 15000,
    navigationTimeout: 60000,
  },
  expect: {
    /* Default timeout for all `expect()` assertions. */
    timeout: 15000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'UI-Chromium',
      testDir: './src/ui/tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL,
      },
    },
    {
      name: 'UI-Firefox',
      testDir: './src/ui/tests',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: process.env.BASE_URL,
      },
    },
    {
      name: 'UI-WebKit',
      testDir: './src/ui/tests',
      use: {
        ...devices['Desktop Safari'],
        baseURL: process.env.BASE_URL,
      },
    },
    {
      name: 'API-Tests',
      testDir: './src/api/tests',
      use: {
        baseURL: process.env.API_URL,
        extraHTTPHeaders: {
          'x-api-key': process.env.API_KEY || '',
        },
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
