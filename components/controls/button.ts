import { Locator, Page, test } from '@playwright/test';

export default class Button {
  page: Page;
  locator: Locator;
  name: string;

  constructor(page: Page, name: string) {
    this.page = page;
    this.locator = this.page.getByRole('button', { name });
  }

  async click(): Promise<void> {
    await test.step(`Click on '${this.name}' button`, async () => {
      await this.locator.click();
    });
  }
}
