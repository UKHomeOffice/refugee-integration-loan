import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilHomePage extends basePage {
  readonly yourAddressAppliedForAnIntegrationLoanBeforeHeaderText: Locator;
  readonly yourAddressAppliedForAnIntegrationLoanBeforeYesLabel: Locator;
  readonly yourAddressAppliedForAnIntegrationLoanBeforeNoLabel: Locator;
  readonly yourAddressAppliedForAnIntegrationLoanBeforeMainError: Locator;
  readonly yourAddressAppliedForAnIntegrationLoanBeforeSubError: Locator;

  constructor(page: Page) {
    super(page);
    this.yourAddressAppliedForAnIntegrationLoanBeforeHeaderText = page
      .locator('div#gov-grid-row-content>div>h1')
      .first();
    this.yourAddressAppliedForAnIntegrationLoanBeforeYesLabel = page
      .locator('div#previouslyApplied-group>fieldset>div>div:nth-of-type(1)>label')
      .first();
    this.yourAddressAppliedForAnIntegrationLoanBeforeNoLabel = page
      .locator('div#previouslyApplied-group>fieldset>div>div:nth-of-type(2)>label')
      .first();
    this.yourAddressAppliedForAnIntegrationLoanBeforeMainError = page
      .locator("a[href='#previouslyApplied-yes']")
      .first();
    this.yourAddressAppliedForAnIntegrationLoanBeforeSubError = page.locator('p#previouslyApplied-error').first();
  }

  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Have you or anyone currently living at your address applied for an integration loan before? – Apply for a refugee integration loan – GOV.UK'
    );
  }

  async openRilStartNowPage(): Promise<void> {
    const response = await this.page.goto(process.env.RIL_START_PATH || '/');
    if (response && response.status() >= 400) {
      throw new Error(
        `Environment blocker: HTTP ${response.status()} at ${this.page.url()}; page title: ${await this.page.title()}`,
      );
    }
  }

  async validateHomePageContent(): Promise<void> {
    await this.getContinueButton();
    await expect(this.yourAddressAppliedForAnIntegrationLoanBeforeHeaderText).toHaveText(
      'Have you or anyone currently living at your address applied for an integration loan before?',
    );
    await expect(this.yourAddressAppliedForAnIntegrationLoanBeforeYesLabel).toHaveText('Yes');
    await expect(this.yourAddressAppliedForAnIntegrationLoanBeforeNoLabel).toHaveText('No');
  }

  async completeHomePage(option: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.completeRadioPage(option);
  }

  async validateHomePageErrors(): Promise<void> {
    await this.getContinueButton();
    await this.clickContinue();
    await expect(this.yourAddressAppliedForAnIntegrationLoanBeforeMainError).toHaveText('Select if you or someone else at your address have previously applied for a loan');
    await expect(this.yourAddressAppliedForAnIntegrationLoanBeforeSubError).toContainText(
      'Select if you or someone else at your address have previously applied for a loan',
    );
  }

  async navigateToUrl(): Promise<void> {
    await this.openRilStartNowPage();
    await this.acceptCookies();
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
  }
}