import { Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilDoYouHaveAnySavingsPage extends basePage {
  readonly amountOfSavingsHeaderText: Locator;
  readonly amountOfSavingsYesLabel: Locator;
  readonly totalAmountOfSavingsLabel: Locator;
  readonly totalAmountOfSavingsInput: Locator;
  readonly amountOfSavingsNoLabel: Locator;
  readonly amountOfSavingsBackNavBtn: Locator;
  readonly amountOfSavingsMainError: Locator;
  readonly amountOfSavingsSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.amountOfSavingsHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.amountOfSavingsYesLabel = page.locator("label[for='savings-yes']").first();
    this.totalAmountOfSavingsLabel = page.locator("label[for='savingsAmount']").first();
    this.totalAmountOfSavingsInput = page.locator('input#savingsAmount').first();
    this.amountOfSavingsNoLabel = page.locator("label[for='savings-no']").first();
    this.amountOfSavingsBackNavBtn = page.locator("a[href='/apply/outgoings']").first();
    this.amountOfSavingsMainError = page.locator("a[href='#previouslyHadIntegrationLoan-yes']").first();
    this.amountOfSavingsSubError = page.locator('p#previouslyHadIntegrationLoan-error').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Do you have any savings? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async completeSavingsPage(option: string, amount: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.getJavascriptCheckBox(option).click();
    if (await this.totalAmountOfSavingsInput.isVisible()) await this.type(this.totalAmountOfSavingsInput, amount);
    await this.clickContinueButton();
  }
}
