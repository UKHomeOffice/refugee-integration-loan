import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilApplyingLoanTogetherWithYourPartnerPage extends basePage {
  readonly applyingLoanTogetherWithPartnerHeaderText: Locator;
  readonly applyingLoanTogetherWithPartnerYesLabel: Locator;
  readonly applyingLoanTogetherWithPartnerNoLabel: Locator;
  readonly applyingLoanTogetherWithPartnerBackNavBtn: Locator;
  readonly applyingLoanTogetherWithPartnerMainError: Locator;
  readonly applyingLoanTogetherWithPartnerSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.applyingLoanTogetherWithPartnerHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.applyingLoanTogetherWithPartnerYesLabel = page.locator("label[for='joint-yes']").first();
    this.applyingLoanTogetherWithPartnerNoLabel = page.locator("label[for='joint-no']").first();
    this.applyingLoanTogetherWithPartnerBackNavBtn = page.locator("a[href='/apply/partner']").first();
    this.applyingLoanTogetherWithPartnerMainError = page.locator("a[href='#joint-yes']").first();
    this.applyingLoanTogetherWithPartnerSubError = page.locator('p#joint-error').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Are you applying for a loan together with your partner? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateApplyingLoanTogetherWithYourPartnerPageContent(): Promise<void> {
    await expect(this.applyingLoanTogetherWithPartnerBackNavBtn).toBeVisible();
    await expect(this.applyingLoanTogetherWithPartnerHeaderText).toHaveText(
      'Are you applying for a loan together with your partner?',
    );
    await expect(this.applyingLoanTogetherWithPartnerYesLabel).toHaveText('Yes');
    await expect(this.applyingLoanTogetherWithPartnerNoLabel).toHaveText('No');
  }
  async validateApplyingLoanTogetherWithYourPartnerPageErrors(): Promise<void> {
    await expect(this.applyingLoanTogetherWithPartnerBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.applyingLoanTogetherWithPartnerMainError).toHaveText(
      'Select if you are applying for a loan together with your partner',
    );
    await expect(this.applyingLoanTogetherWithPartnerSubError).toContainText(
      'Select if you are applying for a loan together with your partner',
    );
  }
  async completeApplyingLoanTogetherWithYourPartnerPage(option: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.completeRadioPage(option);
  }
}
