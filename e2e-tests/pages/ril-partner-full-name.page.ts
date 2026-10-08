import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilPartnerFullNamePage extends basePage {
  readonly partnerFullNameHeaderText: Locator;
  readonly partnerFullNameLabel: Locator;
  readonly partnerFullNameInput: Locator;
  readonly partnerFullNameBackNavBtn: Locator;
  readonly partnerFullNameMainError: Locator;
  readonly partnerFullNameSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.partnerFullNameHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.partnerFullNameLabel = page.locator("label[for='partnerOtherName']").first();
    this.partnerFullNameInput = page.locator('input#partnerOtherName').first();
    this.partnerFullNameBackNavBtn = page.locator("a[href='/apply/partner-has-other-names']").first();
    this.partnerFullNameMainError = page.locator("a[href='#partnerOtherName']").first();
    this.partnerFullNameSubError = page.locator('div#partnerOtherName-group>p').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Full name – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validatePartnerFullNamePageContent(): Promise<void> {
    await expect(this.partnerFullNameBackNavBtn).toBeVisible();
    await expect(this.partnerFullNameHeaderText).toHaveText('Full name');
    await expect(this.partnerFullNameLabel).toHaveText('Full name');
  }
  async validatePartnerFullNamePageErrors(): Promise<void> {
    await expect(this.partnerFullNameBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.partnerFullNameMainError).toHaveText('Enter a full name');
    await expect(this.partnerFullNameSubError).toContainText('Enter a full name');
  }
  async completePartnerFullNamePage(value: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.completeTextPage(this.partnerFullNameInput, value);
  }
}
