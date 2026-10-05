import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilFullNamePage extends basePage {
  readonly fullNameHeaderText: Locator;
  readonly fullNameLabel: Locator;
  readonly fullNameInput: Locator;
  readonly fullNameBackNavBtn: Locator;
  readonly fullNameMainError: Locator;
  readonly fullNameSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.fullNameHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.fullNameLabel = page.locator('div#otherName-group>label').first();
    this.fullNameInput = page.locator('input#otherName').first();
    this.fullNameBackNavBtn = page.locator("a[href='/apply/has-other-names']").first();
    this.fullNameMainError = page.locator("a[href='#otherName']").first();
    this.fullNameSubError = page.locator('div#otherName-group>p').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Full name – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateFullNamePageContent(): Promise<void> {
    await expect(this.fullNameBackNavBtn).toBeVisible();
    await expect(this.fullNameHeaderText).toHaveText('Full name');
    await expect(this.fullNameLabel).toHaveText('Full name');
  }
  async validateFullNamePageErrors(): Promise<void> {
    await expect(this.fullNameBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.fullNameMainError).toHaveText('Enter a full name');
    await expect(this.fullNameSubError).toContainText('Enter a full name');
  }
  async completeFullNamePage(value: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.completeTextPage(this.fullNameInput, value);
  }
}
