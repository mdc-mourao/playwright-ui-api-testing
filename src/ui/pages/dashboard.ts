import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly widgets: Locator;
  readonly dashboardTitle: Locator;

  readonly timeAtWorkWidget: Locator;
  readonly myActionsWidget: Locator;
  readonly shortcutsWidget: Locator;
  readonly feedWidget: Locator;
  readonly leavesWidget: Locator;
  readonly subunitWidget: Locator;
  readonly locationsWidget: Locator;

  readonly sidebarMenuItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.widgets = page.locator(
      '.oxd-grid-item.oxd-grid-item--gutters.orangehrm-dashboard-widget'
    );
    this.dashboardTitle = page.locator('.oxd-topbar-header-title');

    this.timeAtWorkWidget = page
      .locator(
        '.oxd-grid-item.oxd-grid-item--gutters.orangehrm-dashboard-widget'
      )
      .nth(0);
    this.myActionsWidget = page
      .locator(
        '.oxd-grid-item.oxd-grid-item--gutters.orangehrm-dashboard-widget'
      )
      .nth(1);
    this.shortcutsWidget = page
      .locator(
        '.oxd-grid-item.oxd-grid-item--gutters.orangehrm-dashboard-widget'
      )
      .nth(2);
    this.feedWidget = page
      .locator(
        '.oxd-grid-item.oxd-grid-item--gutters.orangehrm-dashboard-widget'
      )
      .nth(3);
    this.leavesWidget = page
      .locator(
        '.oxd-grid-item.oxd-grid-item--gutters.orangehrm-dashboard-widget'
      )
      .nth(4);
    this.subunitWidget = page
      .locator(
        '.oxd-grid-item.oxd-grid-item--gutters.orangehrm-dashboard-widget'
      )
      .nth(5);
    this.locationsWidget = page
      .locator(
        '.oxd-grid-item.oxd-grid-item--gutters.orangehrm-dashboard-widget'
      )
      .nth(6);

    this.sidebarMenuItems = page.locator('.oxd-main-menu-item');
  }

  async validateDashboardTitle() {
    await expect(this.dashboardTitle).toBeVisible();
  }

  async getWidgetCount() {
    return await this.widgets.count();
  }

  async waitForDashboardDataToLoad() {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes('/time-at-work') && resp.status() === 200
      ),
      this.page.waitForResponse(
        (resp) =>
          resp.url().includes('/action-summary') && resp.status() === 200
      ),
      this.page.waitForResponse(
        (resp) => resp.url().includes('/shortcuts') && resp.status() === 200
      ),
      this.page.waitForResponse(
        (resp) => resp.url().includes('/feed') && resp.status() === 200
      ),
      this.page.waitForResponse(
        (resp) => resp.url().includes('/leaves') && resp.status() === 200
      ),
      this.page.waitForResponse(
        (resp) => resp.url().includes('/subunit') && resp.status() === 200
      ),
      this.page.waitForResponse(
        (resp) => resp.url().includes('/locations') && resp.status() === 200
      )
    ]);

    const body = await response.json();
    const nrWidgets = body.data.length;

    return nrWidgets;
  }

  async validateWidgetsFinishedLoading() {
    const loader = this.page.locator('.oxd-loading-spinner');
    await expect(loader).toHaveCount(0);

    await expect(this.timeAtWorkWidget.locator('canvas')).toBeVisible();
    await expect(
      this.myActionsWidget.locator('.orangehrm-todo-list')
    ).toBeVisible();
    await expect(
      this.shortcutsWidget.locator('.orangehrm-quick-launch')
    ).toBeVisible();
    await expect(
      this.feedWidget.locator('.orangehrm-buzz-widget')
    ).toBeVisible();
    await expect(
      this.leavesWidget.locator('.orangehrm-dashboard-widget')
    ).toBeVisible();
    await expect(
      this.subunitWidget.locator('.emp-distrib-chart')
    ).toBeVisible();
    await expect(
      this.locationsWidget.locator('.emp-distrib-chart')
    ).toBeVisible();
  }

  async navigateToMenuItem(menuName: string) {
    const menuLink = this.page.locator('.oxd-main-menu-item', {
      hasText: menuName
    });
    await menuLink.click();
  }
}
