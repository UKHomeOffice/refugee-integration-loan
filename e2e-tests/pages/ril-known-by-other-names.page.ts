import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilKnownByOtherNamesPage extends basePage {
  readonly knownByOtherNamesHeaderText: Locator;
  readonly knownByOtherNamesYesLabel: Locator;
  readonly knownByOtherNamesNoLabel: Locator;
  readonly knownByOtherNamesBackNavBtn: Locator;
  readonly knownByOtherNamesMainError: Locator;
  readonly knownByOtherNamesSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.knownByOtherNamesHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.knownByOtherNamesYesLabel = page.locator("label[for='hasOtherNames-yes']").first();
    this.knownByOtherNamesNoLabel = page.locator("label[for='hasOtherNames-no']").first();
    this.knownByOtherNamesBackNavBtn = page.locator("a[href='/apply/ni-number']").first();
    this.knownByOtherNamesMainError = page.locator("a[href='#hasOtherNames-yes']").first();
    this.knownByOtherNamesSubError = page.locator('p#hasOtherNames-error').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Have you been known by any other names? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateKnownByOtherNamesPageContent(): Promise<void> {
    await expect(this.knownByOtherNamesBackNavBtn).toBeVisible();
    await expect(this.knownByOtherNamesHeaderText).toHaveText('Have you been known by any other names?');
    await expect(this.knownByOtherNamesYesLabel).toHaveText('Yes');
    await expect(this.knownByOtherNamesNoLabel).toHaveText('No');
  }
  async validateKnownByOtherNamesPageErrors(): Promise<void> {
    await expect(this.knownByOtherNamesBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.knownByOtherNamesMainError).toHaveText('Select if you have been known by any other names');
    await expect(this.knownByOtherNamesSubError).toContainText('Select if you have been known by any other names');
  }
  async completeKnownByOtherNamesPage(option: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.completeRadioPage(option);
  }
}
