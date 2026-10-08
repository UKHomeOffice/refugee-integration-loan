import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilDependantsLivingWithYouPage extends basePage {
  readonly dependantsLivingWithYouUkHeaderText: Locator;
  readonly dependantsLivingWithYouUkYesLabel: Locator;
  readonly dependantsLivingWithYouUkNoLabel: Locator;
  readonly dependantsLivingWithYouUkMainError: Locator;
  readonly dependantsLivingWithYouUkSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.dependantsLivingWithYouUkHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.dependantsLivingWithYouUkYesLabel = page.locator("label[for='hasDependants-yes']").first();
    this.dependantsLivingWithYouUkNoLabel = page.locator("label[for='hasDependants-no']").first();
    this.dependantsLivingWithYouUkMainError = page.locator("a[href='#hasDependants-yes']").first();
    this.dependantsLivingWithYouUkSubError = page.locator('p#hasDependants-error').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Do you have any dependants living with you? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateDependantsLivingWithYouPageContent(): Promise<void> {
    await this.getContinueButton();
    await expect(this.dependantsLivingWithYouUkHeaderText).toHaveText('Do you have any dependants living with you?');
    await expect(this.dependantsLivingWithYouUkYesLabel).toHaveText('Yes');
    await expect(this.dependantsLivingWithYouUkNoLabel).toHaveText('No');
  }
  async validateDependantsLivingWithYouPageErrors(): Promise<void> {
    await this.getContinueButton();
    await this.clickContinue();
    await expect(this.dependantsLivingWithYouUkMainError).toHaveText(
      'Select if you have any dependants living with you',
    );
    await expect(this.dependantsLivingWithYouUkSubError).toContainText(
      'Select if you have any dependants living with you',
    );
  }
  async completeDependantsLivingWithYouPage(option: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.completeRadioPage(option);
  }
}
