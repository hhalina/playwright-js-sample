import { Page } from '@playwright/test';
import Button from 'components/controls/button';
import Dropdown from 'components/controls/dropdown';
import BasePage from 'pages/base.page';

export default class SalaryInsightsPage extends BasePage {
  constructor(page: Page) {
    super(page, '/salary-insights');
  }

  get role(): Dropdown {
    return new Dropdown(this.page, 'role');
  }

  get country(): Dropdown {
    return new Dropdown(this.page, 'country');
  }

  get searchButton(): Button {
    return new Button(this.page, 'Search');
  }

  get salaryTableLocator(): string {
    return '[data-qa="salary-table"]';
  }

  get medianSalary() {
    return this.page.locator('text=The median salary is');
  }
}
