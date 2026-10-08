import { Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilLoanAmountPage extends basePage {
  readonly loanAmountHeaderText: Locator;
  readonly loanAmountLabel: Locator;
  readonly loanAmountApplyLabel: Locator;
  readonly loanAmountInput: Locator;
  readonly loanAmountBackNavBtn: Locator;
  readonly loanAmountMainError: Locator;
  readonly loanAmountSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.loanAmountHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.loanAmountLabel = page.locator("label[for='amount']").first();
    this.loanAmountApplyLabel = this.hintLocator('span#amount-hint');
    this.loanAmountInput = page.locator('input#amount').first();
    this.loanAmountBackNavBtn = page.locator("a[href='/apply/savings']").first();
    this.loanAmountMainError = page.locator("a[href='#amount']").first();
    this.loanAmountSubError = page.locator("p[class='govuk-error-message']").first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'What loan amount would you like to apply for? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async completeLoanAmountPage(value: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.completeTextPage(this.loanAmountInput, value);
  }
}
