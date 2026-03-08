import { expect, Locator, Page } from '@playwright/test';

export class PimPage {
    readonly page: Page;
    readonly pimMenu: Locator;
    readonly employeeListTable: Locator;
    readonly employeeRecord: Locator;
    readonly nameCells: Locator;
    readonly searchEmployee: Locator;
    readonly searchList: Locator;
    readonly submitButton: Locator;
    readonly addButton: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly employeeId: Locator;
    readonly successToast: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.pimMenu = page.locator('a[href*="viewPimModule"]');
        this.employeeListTable = this.page.locator('[role=table]');
        this.employeeRecord = this.page.locator('.oxd-table-card');
        this.nameCells = page.locator('.oxd-table-cell');
        this.searchEmployee = this.page.locator('input[placeholder="Type for hints..."]').first();
        this.searchList = this.page.locator('[role=listbox]');
        this.submitButton = this.page.locator('button[type="submit"]');
        this.addButton = this.page.locator('.orangehrm-header-container').locator('button').first();
        this.firstNameInput = this.page.locator('input[name="firstName"]');
        this.lastNameInput = this.page.locator('input[name="lastName"]');
        this.employeeId = this.page.locator('.oxd-input');
        this.successToast = this.page.locator('.oxd-toast--success');
    }

    async redirectToPIMPage() {
        await this.pimMenu.click()
        await this.page.waitForURL('**/pim/viewEmployeeList', { timeout: 10000 }),
        await this.employeeRecord.first().waitFor({ state: 'visible', timeout: 10000 });
    }
    
    async verifyEmployeeListIsVisible() {
        await expect(this.employeeListTable).toBeVisible({ timeout: 10000 });
        const count = await this.employeeRecord.count();
        expect(count).toBeGreaterThan(0);
    }

    async searchEmployeeByName(name: string) {
        await this.searchEmployee.fill(name.split(' ')[0]);
        await this.searchList.waitFor({ state: 'visible' });
        await this.page.getByRole('option', { name: name }).click();

        await Promise.all([
            this.page.waitForResponse(resp =>
                resp.url().includes('/api/v2/pim/employees') &&
                resp.status() === 200
            ),
            await this.submitButton.click()
        ]);
    }

    async searchEmployeeByID(id: string) {
        await this.employeeId.last().fill(id);
        await Promise.all([
            this.page.waitForResponse(resp =>
                resp.url().includes('/api/v2/pim/employees') &&
                resp.status() === 200
            ),
            await this.submitButton.click()
        ]);
    }

    async getFullEmployeeNames(): Promise<string> {
        await this.employeeRecord.first().waitFor({ state: 'visible' });
        const firstName = (await this.nameCells.nth(2).innerText())?.trim();
        const lastName = (await this.nameCells.nth(3).innerText())?.trim();
    
        return `${firstName} ${lastName}`;
    }

    async getEmployeeID(): Promise<string> {
        await this.employeeRecord.first().waitFor({ state: 'visible' });
        const id = (await this.nameCells.nth(1).innerText())?.trim();
    
        return id;
    }

    async addEmployee(firstName: string, lastName: string, id: string){
        await this.addButton.click();
        await this.page.waitForURL('**/pim/addEmployee');
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        
        await this.page.locator('form').locator('input').nth(4).clear();
        await this.employeeId.last().fill(id);

        await this.submitButton.click();
        await expect(this.successToast).toBeVisible({ timeout: 5000 });
        await this.page.waitForURL('**/pim/viewPersonalDetails/empNumber/**');
    }

    async validateEmployeeProfile(firstName: string, lastName: string, id: string){
        await expect(this.firstNameInput).toHaveValue(firstName);
        await expect(this.lastNameInput).toHaveValue(lastName);
        await expect(this.employeeId.nth(4)).toHaveValue(id);
    }
}
    