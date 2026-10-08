import { Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilConvictedOfACrimeInTheUKPage extends basePage {
  readonly convictedOfACrimeDetailsInput: Locator;
  constructor(page: Page) {
    super(page);
    this.convictedOfACrimeDetailsInput = page.locator('textarea#detailsOfCrime').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Have you ever been convicted of a crime in the UK? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async completeConvictedOfACrimePage(option: string, details: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.getJavascriptCheckBox(option).click();
    if (await this.convictedOfACrimeDetailsInput.isVisible())
      await this.type(this.convictedOfACrimeDetailsInput, details);
    await this.clickContinueButton();
  }
}
