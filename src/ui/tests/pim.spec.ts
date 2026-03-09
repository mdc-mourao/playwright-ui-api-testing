import { test, expect } from '../fixtures/base';
import { apiFactory } from '../../utils/apiFactory';

test.describe('@B2 @UI Test Automation - Employee Directory PIM', () => {
  test.beforeEach(async ({ page, baseURL, loginPage }) => {
    await page.goto(baseURL || '', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await loginPage.fillLoginCredencials();
    await loginPage.redirectToHomePage();
  });

  test('Navigate to PIM Module', async ({ page, pimPage }) => {
    await pimPage.redirectToPIMPage();
    await pimPage.verifyEmployeeListIsVisible();
    await expect(page.locator('.oxd-topbar-header-title')).toBeVisible();
  });

  test('Navigate to PIM Module and search for an employee', async ({
    pimPage,
  }) => {
    await pimPage.redirectToPIMPage();
    await pimPage.verifyEmployeeListIsVisible();

    const firstEmployeeName = await pimPage.getFullEmployeeNames();
    await pimPage.searchEmployeeByName(firstEmployeeName!);
    const searchResultName = await pimPage.getFullEmployeeNames();
    expect(searchResultName).toBe(firstEmployeeName);
    await expect(pimPage.employeeRecord).toHaveCount(1);
  });

  test('Navigate to PIM Module and create an employee', async ({ pimPage }) => {
    const employeeData = apiFactory.getRandomName();

    await test.step('Create an employee and validate the profile info', async ({}) => {
      await pimPage.redirectToPIMPage();
      await pimPage.verifyEmployeeListIsVisible();
      await pimPage.addEmployee(
        employeeData.firstName,
        employeeData.lastName,
        employeeData.id
      );
      await pimPage.validateEmployeeProfile(
        employeeData.firstName,
        employeeData.lastName,
        employeeData.id
      );
    });

    await test.step('Go back to the PIM module and check if its visible on the list', async ({}) => {
      await pimPage.redirectToPIMPage();
      await pimPage.verifyEmployeeListIsVisible();
      await pimPage.searchEmployeeByID(employeeData.id);
      const newEmployeeFullName = await pimPage.getFullEmployeeNames();
      expect(`${employeeData.firstName} ${employeeData.lastName}`).toBe(
        newEmployeeFullName
      );
      const newEmployeeID = await pimPage.getEmployeeID();
      expect(employeeData.id).toBe(newEmployeeID);
    });
  });
});
