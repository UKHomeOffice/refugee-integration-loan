import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilPartnerWithYouInTheUKPage extends basePage {
  readonly partnerWithYouInTheUKHeaderText: Locator;
  readonly partnerWithYouInTheUKAgeText: Locator;
  readonly partnerWithYouInTheUKYesRadioLabel: Locator;
  readonly partnerWithYouInTheUKNoRadioLabel: Locator;
  readonly partnerWithYouInTheUKMainError: Locator;
  readonly partnerWithYouInTheUKSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.partnerWithYouInTheUKHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.partnerWithYouInTheUKAgeText = page.locator('div#gov-grid-row-content>div>form>p').first();
    this.partnerWithYouInTheUKYesRadioLabel = page.locator("label[for='partner-yes']").first();
    this.partnerWithYouInTheUKNoRadioLabel = page.locator("label[for='partner-no']").first();
    this.partnerWithYouInTheUKMainError = page.locator("a[href='#partner-yes']").first();
    this.partnerWithYouInTheUKSubError = page.locator('p#partner-error').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Do you have a partner with you in the UK? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validatePartnerWithYouInTheUKPageContent(): Promise<void> {
    await this.getContinueButton();
    await expect(this.partnerWithYouInTheUKHeaderText).toHaveText('Do you have a partner with you in the UK?');
    await expect(this.partnerWithYouInTheUKAgeText).toHaveText(
      'A partner is someone over the age of 18 who you\u2019re married to or in a civil partnership with, or live with as if you are.',
    );
    await expect(this.partnerWithYouInTheUKYesRadioLabel).toHaveText('Yes');
    await expect(this.partnerWithYouInTheUKNoRadioLabel).toHaveText('No');
  }
  async validatePartnerWithYouInTheUKPageErrors(): Promise<void> {
    await this.getContinueButton();
    await this.clickContinue();
    await expect(this.partnerWithYouInTheUKMainError).toHaveText(
      'Select if you have a partner with you in the UK or not',
    );
    await expect(this.partnerWithYouInTheUKSubError).toContainText(
      'Select if you have a partner with you in the UK or not',
    );
  }
  async completePartnerWithYouInTheUKPage(option: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.completeRadioPage(option);
  }
}
