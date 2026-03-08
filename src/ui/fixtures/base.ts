import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { PimPage } from '../pages/pim';

type MyFixtures = {
  loginPage: LoginPage;
  pimPage: PimPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  
  pimPage: async ({ page }, use) => {
    await use(new PimPage(page));
  }
});

export { expect } from '@playwright/test';