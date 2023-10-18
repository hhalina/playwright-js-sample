import { Locator, Page, test } from '@playwright/test';

export default abstract class BasePage {
  protected page: Page;
  fullUrl: string;

  protected constructor(page: Page, relUrl = '') {
    this.page = page;
    this.fullUrl = `${process.env.BASE_URL}${relUrl}`;
  }

  async view(): Promise<void> {
    await test.step(`Load page: ${this.fullUrl}`, async () => {
      await this.page.goto(this.fullUrl, { waitUntil: 'load' });
    });
  }

  async waitForElementVisible(locator: string) {
    await test.step(`Wait for element ${locator} to become visible`, () => {
      return this.page.waitForSelector(locator, { state: 'visible' });
    });
  }

  async waitForResponse(requestUrl: string): Promise<void> {
    await test.step(`Wait for response: ${requestUrl}`, async () => {
      await this.page.waitForResponse(requestUrl);
    });
  }

  async waitForState(state: 'load' | 'networkidle' | 'domcontentloaded' = 'load'): Promise<void> {
    await test.step(`Wait for "${state}" page state`, async () => {
      await this.page.waitForLoadState(state);
    });
  }

  async getElementText(locator: Locator): Promise<string> {
    return test.step(`Get element text: '${locator}'`, async () => {
      return locator.innerText();
    });
  }

  async getElementStyle(locator: Locator, property: string): Promise<string> {
    return test.step('Get element style', async () => {
      return locator.evaluate((element: HTMLElement, value: string) => {
        return window.getComputedStyle(element).getPropertyValue(value);
      }, property);
    });
  }

  async getElementAttributeValue(locator: Locator, attribute: string): Promise<string> {
    return test.step(`Get value of ${attribute} atrribute of element`, async () => {
      return locator.getAttribute(attribute);
    });
  }

  async readTextFromClipboard(): Promise<string> {
    return test.step('Read text from clipboard', async () => {
      return this.page.evaluate(() => {
        return navigator.clipboard.readText();
      });
    });
  }
  async scrollToTheBottom(): Promise<void> {
    await test.step('Scroll page to the bottom', async () => {
      await this.page.keyboard.press('End');
    });
  }
}
