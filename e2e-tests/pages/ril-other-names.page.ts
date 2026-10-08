import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilOtherNamesPage extends basePage {
  readonly otherNamesHeaderText: Locator;
  readonly addAnotherNameLink: Locator;
  readonly otherNamesBackNavBtn: Locator;
  constructor(page: Page) {
    super(page);
    this.otherNamesHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.addAnotherNameLink = page.locator("a[href='/apply/add-other-name']").first();
    this.otherNamesBackNavBtn = page.locator("a[href='/apply/has-other-names']").first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Other names – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateOtherNamesPageContent(): Promise<void> {
    await expect(this.otherNamesBackNavBtn).toBeVisible();
    await expect(this.otherNamesHeaderText).toHaveText('Other names');
    await expect(this.addAnotherNameLink).toHaveText('Add another name');
  }
  async completeOtherNamesPage(expectedName: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.verifyTextToAppear(expectedName);
    await this.clickContinueButton();
  }
}
