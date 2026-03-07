import { test, expect } from '@playwright/test';

test('Simple 1st test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});