import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  private page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly userOptions: Locator;
  readonly title: Locator;

  private readonly username = process.env.USER_NAME || '';
  private readonly password = process.env.PASSWORD || '';

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = this.page.locator('input[name="username"]');
    this.passwordInput = this.page.locator('input[name="password"]');
    this.loginButton = this.page.locator('button[type="submit"]');
    this.userOptions = this.page.locator('.oxd-userdropdown-tab');
    this.title = this.page.locator('.oxd-topbar-header-title');
  }

  async fillLoginCredencials(username?: string, password?: string) {
    const user = username !== undefined ? username : this.username;
    const pass = password !== undefined ? password : this.password;
    await expect(this.usernameInput).toBeVisible({ timeout: 50000 });
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
  }

  async redirectToHomePage() {
    await this.loginButton.click();
    await this.page.waitForURL('**/dashboard/**');
    await expect(this.page).toHaveURL(/.*dashboard.*/);
    await expect(this.title).toBeVisible();
  }

  async validateErrorMessage(field: string, message: string) {
    await expect(this.page).toHaveURL(/.*login.*/);
    const errorMessage = this.page.locator(
      `.oxd-input-group:has(input[name="${field}"]) span.oxd-input-field-error-message`
    );
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(message);
  }

  async logout() {
    await this.userOptions.click();
    const logoutOption = this.page.locator('a[href*="/auth/logout"]');
    await expect(logoutOption).toBeVisible();
    await logoutOption.click();
    await expect(this.page).toHaveURL(/.*login.*/);
  }
}
