import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import SalaryInsightsPage from '../pages/salary-insights.page';
import { listener, waitForInterceptedRequest } from '../utils/network-interception.helper';

test.beforeEach(async () => {
  allure.feature('Widget');
});

test.describe(() => {
  for (const { role, country, countryCode } of [
    { role: 'Accountant', country: 'Brazil', countryCode: 'BR' },
    { role: 'QA Engineer', country: 'Canada', countryCode: 'CA' },
    { role: 'Software Engineer', country: 'Japan', countryCode: 'JP' },
  ]) {
    test(`Check salary page for ${role} and ${country}`, async ({ page }) => {
      allure.id('962');
      allure.description(`Test steps:
      Step 1: Go to widget page
      Step 2: Fill widget calculator inputs
      Step 3: Click Exchange button
        Expected result:
        - Separate browser window has been opened
        - 'From' value is equal to expected
        - 'From' currency is equal to expected
        - 'To' value is equal to expected`);

      const uiPage = new SalaryInsightsPage(page);
      await uiPage.view();

      const interceptedRequests = [];
      await listener(page, '/salary_insights', interceptedRequests, [{ requestType: 'GET' }]);

      await uiPage.role.selectItem(role, 'Select a role');
      await uiPage.country.selectItem(country, 'Select a country');
      await uiPage.searchButton.click();

      await waitForInterceptedRequest(interceptedRequests);
      await uiPage.waitForElementVisible(uiPage.salaryTableLocator);

      const medianSalaryText = await uiPage.medianSalary.innerText();
      const salary = parseFloat(medianSalaryText.match(/\d+\.\d+/)[0]);

      await test.step('Check number of requests is 1', () => expect.soft(interceptedRequests).toHaveLength(1));
      await test.step('Check response country', () =>
        expect.soft(interceptedRequests[0].response.country).toEqual(countryCode));

      await test.step('Check response job title', () =>
        expect.soft(interceptedRequests[0].response.jobTitle).toEqual(role));

      await test.step('Check response median salary is same that is on form', () =>
        expect.soft(parseFloat(interceptedRequests[0].response.median.toFixed(2))).toEqual(salary));
    });
  }
});
