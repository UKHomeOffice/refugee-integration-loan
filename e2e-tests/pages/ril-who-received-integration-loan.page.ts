import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilWhoReceivedIntegrationLoanPage extends basePage {
  readonly receivedIntegrationLoanHeaderText: Locator;
  readonly receivedIntegrationLoanMeLabel: Locator;
  readonly receivedIntegrationLoanMyPartnerLabel: Locator;
  readonly receivedIntegrationAnotherPersonLivingAtMyAddressLabel: Locator;
  readonly receivedIntegrationLoanBackNavBtn: Locator;
  readonly receivedIntegrationLoanMainError: Locator;
  readonly receivedIntegrationLoanSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.receivedIntegrationLoanHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.receivedIntegrationLoanMeLabel = page.locator("label[for='whoReceivedPreviousLoan-me']").first();
    this.receivedIntegrationLoanMyPartnerLabel = page.locator("label[for='whoReceivedPreviousLoan-partner']").first();
    this.receivedIntegrationAnotherPersonLivingAtMyAddressLabel = page
      .locator("label[for='whoReceivedPreviousLoan-someoneElse']")
      .first();
    this.receivedIntegrationLoanBackNavBtn = page.locator("a[href='/apply/previous']").first();
    this.receivedIntegrationLoanMainError = page.locator("a[href='#whoReceivedPreviousLoan-me']").first();
    this.receivedIntegrationLoanSubError = page.locator('p#whoReceivedPreviousLoan-error').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Who received the integration loan? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateWhoReceivedIntegrationLoanPageContent(): Promise<void> {
    await expect(this.receivedIntegrationLoanBackNavBtn).toBeVisible();
    await expect(this.receivedIntegrationLoanHeaderText).toHaveText('Who received the integration loan?');
    await expect(this.receivedIntegrationLoanMeLabel).toHaveText('Me');
    await expect(this.receivedIntegrationLoanMyPartnerLabel).toHaveText('My partner');
    await expect(this.receivedIntegrationAnotherPersonLivingAtMyAddressLabel).toHaveText(
      'Another person living at my address',
    );
  }
  async validateWhoReceivedIntegrationLoanPageError(): Promise<void> {
    await expect(this.receivedIntegrationLoanBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.receivedIntegrationLoanMainError).toHaveText('Select who was granted the loan');
    await expect(this.receivedIntegrationLoanSubError).toContainText('Select who was granted the loan');
  }
  async selectWhoReceivedTheIntegrationLoanPage(option: string): Promise<void> {
    await this.getContinueButton();
    switch (option) {
      case 'Me':
        await this.getJavascriptCheckBox('Me').click();
        break;
      case 'My partner':
        await this.getJavascriptCheckBox('My partner').click();
        break;
      case 'Another person living at my address':
        await this.getJavascriptCheckBox('Another person living at my address').click();
        break;
      default:
        throw new Error('Invalid option: ' + option);
    }
    await this.clickContinue();
  }
}
