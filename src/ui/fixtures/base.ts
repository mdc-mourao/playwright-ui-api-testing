import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { PimPage } from '../pages/pim';
import { DashboardPage } from '../pages/dashboard';

type MyFixtures = {
  loginPage: LoginPage;
  pimPage: PimPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  
  pimPage: async ({ page }, use) => {
    await use(new PimPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  }
});

export { expect } from '@playwright/test';