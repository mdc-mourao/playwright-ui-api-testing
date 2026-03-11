import { test, expect } from '../fixtures/base';

test.describe('@B3 @UI Test Automation - Dashboard Tests', () => {
  test.beforeEach(async ({ page, loginPage, baseURL }) => {
    await page.goto(baseURL || '', {
      waitUntil: 'commit',
      timeout: 60000
    });
    await loginPage.fillLoginCredencials();
    await loginPage.redirectToHomePage();
  });

  test('Verify that key dashboard elements/widgets are visible and rendered', async ({
    dashboardPage
  }) => {
    await dashboardPage.validateDashboardTitle();
    const nrWidgetsResponse = await dashboardPage.waitForDashboardDataToLoad();
    const nrWidgetsUI = await dashboardPage.getWidgetCount();
    expect(nrWidgetsResponse).toBe(nrWidgetsUI);

    for (let i = 0; i < nrWidgetsResponse; i++) {
      await expect(dashboardPage.widgets.nth(i)).toBeVisible();
    }

    await dashboardPage.validateWidgetsFinishedLoading();
  });

  const menuItems = [
    { name: 'Admin', path: '/admin/viewSystemUsers' },
    { name: 'PIM', path: '/pim/viewEmployeeList' },
    { name: 'Leave', path: '/leave/viewLeaveList' },
    { name: 'Time', path: '/time/viewEmployeeTimesheet' },
    { name: 'Recruitment', path: '/recruitment/viewCandidates' },
    { name: 'My Info', path: '/pim/viewPersonalDetails' },
    {
      name: 'Performance',
      path: '/performance/searchEvaluatePerformanceReview'
    },
    { name: 'Dashboard', path: '/dashboard/index' },
    { name: 'Directory', path: '/directory/viewDirectory' },
    { name: 'Claim', path: '/claim/viewAssignClaim' },
    { name: 'Buzz', path: '/buzz/viewBuzz' },
    { name: 'Maintenance', path: '/maintenance/purgeEmployee' }
  ];
  for (const item of menuItems) {
    test(`Click on ${item.name}`, async ({ page, dashboardPage }) => {
      await dashboardPage.navigateToMenuItem(item.name);
      await page.waitForURL(new RegExp(item.path));
      const currentUrl = page.url();
      expect(currentUrl).toContain(item.path);
    });
  }
});
