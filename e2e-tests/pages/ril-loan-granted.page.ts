import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilLoanGrantedPage extends basePage {
  readonly loanGrantedHeaderText: Locator;
  readonly loanGrantedYesLabel: Locator;
  readonly loanGrantedNoLabel: Locator;
  readonly loanGrantedBackNavBtn: Locator;
  readonly loanGrantedMainError: Locator;
  readonly loanGrantedSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.loanGrantedHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.loanGrantedYesLabel = page.locator("label[for='previouslyHadIntegrationLoan-yes']").first();
    this.loanGrantedNoLabel = page.locator("label[for='previouslyHadIntegrationLoan-no']").first();
    this.loanGrantedBackNavBtn = page.locator("a[href='/apply/previously-applied']").first();
    this.loanGrantedMainError = page.locator("a[href='#previouslyHadIntegrationLoan-yes']").first();
    this.loanGrantedSubError = page.locator('p#previouslyHadIntegrationLoan-error').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Was the loan granted? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateLoanGrantedPageContent(): Promise<void> {
    await expect(this.loanGrantedBackNavBtn).toBeVisible();
    await expect(this.loanGrantedHeaderText).toHaveText('Was the loan granted?');
    await expect(this.loanGrantedYesLabel).toHaveText('Yes');
    await expect(this.loanGrantedNoLabel).toHaveText('No');
  }
  async validateLoanGrantedPageError(): Promise<void> {
    await expect(this.loanGrantedBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.loanGrantedMainError).toHaveText('Select if the loan was granted or not');
    await expect(this.loanGrantedSubError).toContainText('Select if the loan was granted or not');
  }
  async completeLoanGrantedPage(option: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.completeRadioPage(option);
  }
}
