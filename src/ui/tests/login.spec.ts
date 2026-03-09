import { test, expect } from '../fixtures/base';

test.describe('@B1 @UI Test Automation - Login Tests', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL || '', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
  });

  test('Successful Login', async ({ page, loginPage }) => {
    // Enter Valid Credentials
    await loginPage.fillLoginCredencials();
    // Verify redirection to Dashboard and it loads successfully
    await loginPage.redirectToHomePage();
    await expect(page.locator('.oxd-topbar-header-title')).toBeVisible();
  });

  test('Failed Login - invalid password', async ({ page, loginPage }) => {
    // Enter an invalid password
    await loginPage.fillLoginCredencials(
      process.env.USER_NAME,
      'invalidPassword'
    );
    await loginPage.loginButton.click();
    await expect(page).toHaveURL(/.*login.*/);
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).toContainText('Invalid credentials');
  });

  test('Failed Login - empty fields', async ({ loginPage }) => {
    await loginPage.fillLoginCredencials('', '');
    await loginPage.loginButton.click();
    await loginPage.validateErrorMessage('username', 'Required');
    await loginPage.validateErrorMessage('password', 'Required');
  });

  test('Logout', async ({ loginPage }) => {
    await loginPage.fillLoginCredencials();
    await loginPage.redirectToHomePage();
    await loginPage.logout();
  });
});
