import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilPartnerOtherNamesPage extends basePage {
  readonly partnerOtherNamesHeaderText: Locator;
  readonly partnerAddAnotherNameLink: Locator;
  readonly partnerOtherNamesBackNavBtn: Locator;
  constructor(page: Page) {
    super(page);
    this.partnerOtherNamesHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.partnerAddAnotherNameLink = page.locator("a[href='/apply/partner-add-other-name']").first();
    this.partnerOtherNamesBackNavBtn = page.locator("a[href='/apply/partner-has-other-names']").first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      "Partner's other names – Apply for a refugee integration loan – GOV.UK"
    );
  }
  async validatePartnerOtherNamesPageContent(): Promise<void> {
    await expect(this.partnerOtherNamesBackNavBtn).toBeVisible();
    await expect(this.partnerOtherNamesHeaderText).toHaveText("Partner's other names");
    await expect(this.partnerAddAnotherNameLink).toHaveText('Add another name');
  }
  async completePartnerOtherNamesPage(): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.clickContinueButton();
  }
}
