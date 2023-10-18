import { Locator, Page, test } from '@playwright/test';

export default class Dropdown {
  page: Page;
  name: string;
  locatorBody: Locator;
  locatorItem: Locator;

  constructor(page: Page, name: string = '') {
    this.page = page;
    this.name = name;
  }

  async selectItem(itemName: string, placeholder: string): Promise<void> {
    await test.step(`Choose '${itemName}' item in '${this.name}' dropdown`, async () => {
      await this.page.getByPlaceholder(placeholder).click();
      await this.page.getByRole('option', { name: itemName }).click();
    });
  }
}
