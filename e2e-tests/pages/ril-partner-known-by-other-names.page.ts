import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilPartnerKnownByOtherNamesPage extends basePage {
  readonly partnerKnownByOtherNamesHeaderText: Locator;
  readonly partnerKnownByOtherNamesYesLabel: Locator;
  readonly partnerKnownByOtherNamesNoLabel: Locator;
  readonly partnerKnownByOtherNamesBackNavBtn: Locator;
  readonly partnerKnownByOtherNamesMainError: Locator;
  readonly partnerKnownByOtherNamesSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.partnerKnownByOtherNamesHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.partnerKnownByOtherNamesYesLabel = page.locator("label[for='partnerHasOtherNames-yes']").first();
    this.partnerKnownByOtherNamesNoLabel = page.locator("label[for='partnerHasOtherNames-no']").first();
    this.partnerKnownByOtherNamesBackNavBtn = page.locator("a[href='/apply/partner-ni-number']").first();
    this.partnerKnownByOtherNamesMainError = page.locator("a[href='#partnerHasOtherNames-yes']").first();
    this.partnerKnownByOtherNamesSubError = page.locator('p#partnerHasOtherNames-error').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Has your partner been known by any other names? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validatePartnerKnownByOtherNamesPageContent(): Promise<void> {
    await expect(this.partnerKnownByOtherNamesBackNavBtn).toBeVisible();
    await expect(this.partnerKnownByOtherNamesHeaderText).toHaveText('Has your partner been known by any other names?');
    await expect(this.partnerKnownByOtherNamesYesLabel).toHaveText('Yes');
    await expect(this.partnerKnownByOtherNamesNoLabel).toHaveText('No');
  }
  async validatePartnerKnownByOtherNamesPageErrors(): Promise<void> {
    await expect(this.partnerKnownByOtherNamesBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.partnerKnownByOtherNamesMainError).toHaveText(
      'Select if your partner has been known by any other names',
    );
    await expect(this.partnerKnownByOtherNamesSubError).toContainText(
      'Select if your partner has been known by any other names',
    );
  }
  async completePartnerKnownByOtherNamesPage(option: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.completeRadioPage(option);
  }
}
