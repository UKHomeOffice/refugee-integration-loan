import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
import { PageInputValues } from '../test-data/page-input-values';
export class RilCombinedLoanAmountPage extends basePage {
  readonly combinedLoanAmountHeaderText: Locator;
  readonly combinedLoanAmountLabel: Locator;
  readonly combinedLoanAmountApplyLabel: Locator;
  readonly combinedLoanAmountInput: Locator;
  readonly combinedLoanAmountBackNavBtn: Locator;
  readonly combinedLoanAmountMainError: Locator;
  readonly combinedLoanAmountSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.combinedLoanAmountHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.combinedLoanAmountLabel = page.locator("label[for='jointAmount']").first();
    this.combinedLoanAmountApplyLabel = this.hintLocator('span#jointAmount-hint');
    this.combinedLoanAmountInput = page.locator('input#jointAmount').first();
    this.combinedLoanAmountBackNavBtn = page.locator("a[href='/apply/combined-savings']").first();
    this.combinedLoanAmountMainError = page.locator("a[href='#jointAmount']").first();
    this.combinedLoanAmountSubError = page.locator("p[class='govuk-error-message']").first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'What loan amount would you like to apply for? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateLoanAmountPageContent(): Promise<void> {
    await expect(this.combinedLoanAmountBackNavBtn).toBeVisible();
    await expect(this.combinedLoanAmountHeaderText).toHaveText('What loan amount would you like to apply for?');
    await expect(this.combinedLoanAmountLabel).toHaveText('Loan amount');
    await expect(this.combinedLoanAmountApplyLabel).toHaveText(
      'You can apply for a minimum of £100 and a maximum of £780.',
    );
  }
  async validateLoanAmountPageErrors(values: PageInputValues): Promise<void> {
    await expect(this.combinedLoanAmountBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.combinedLoanAmountMainError).toHaveText('Enter loan amount');
    await expect(this.combinedLoanAmountSubError).toContainText('Enter loan amount');
    await this.clearAndEnterTextInElement(this.combinedLoanAmountInput, values.zeroAmount);
    await this.clickContinue();
    await expect(this.combinedLoanAmountMainError).toHaveText(
      'Enter loan amount between £100.00 and £780.00 in pounds and pence',
    );
    await expect(this.combinedLoanAmountSubError).toContainText(
      'Enter loan amount between £100.00 and £780.00 in pounds and pence',
    );
    await this.clearAndEnterTextInElement(this.combinedLoanAmountInput, values.amount99);
    await this.clickContinue();
    await expect(this.combinedLoanAmountMainError).toHaveText(
      'Enter loan amount between £100.00 and £780.00 in pounds and pence',
    );
    await expect(this.combinedLoanAmountSubError).toContainText(
      'Enter loan amount between £100.00 and £780.00 in pounds and pence',
    );
    await this.clearAndEnterTextInElement(this.combinedLoanAmountInput, values.currencySymbolAmount);
    await this.clickContinue();
    await expect(this.combinedLoanAmountMainError).toHaveText(
      'Enter loan amount between £100.00 and £780.00 in pounds and pence',
    );
    await expect(this.combinedLoanAmountSubError).toContainText(
      'Enter loan amount between £100.00 and £780.00 in pounds and pence',
    );
    await this.clearAndEnterTextInElement(this.combinedLoanAmountInput, values.threeDecimalAmount);
    await this.clickContinue();
    await expect(this.combinedLoanAmountMainError).toHaveText(
      'Enter loan amount between £100.00 and £780.00 in pounds and pence',
    );
    await expect(this.combinedLoanAmountSubError).toContainText(
      'Enter loan amount between £100.00 and £780.00 in pounds and pence',
    );
    await this.clearAndEnterTextInElement(this.combinedLoanAmountInput, values.aboveMaximumLoanAmount);
    await this.clickContinue();
    await expect(this.combinedLoanAmountMainError).toHaveText(
      'Enter loan amount between £100.00 and £780.00 in pounds and pence',
    );
    await expect(this.combinedLoanAmountSubError).toContainText(
      'Enter loan amount between £100.00 and £780.00 in pounds and pence',
    );
  }
  async completeCombinedLoanAmountPage(value: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.completeTextPage(this.combinedLoanAmountInput, value);
  }
}
