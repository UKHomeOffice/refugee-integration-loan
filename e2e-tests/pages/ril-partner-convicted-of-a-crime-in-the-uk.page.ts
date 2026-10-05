import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
import { ConstantsLib } from '../utility-helper/constants-lib';
export class RilPartnerConvictedOfACrimeInTheUKPage extends basePage {
  readonly partnerConvictedOfACrimeText: Locator;
  readonly partnerConvictedOfACrimeLabel: Locator;
  readonly partnerConvictedOfACrimeYesLabel: Locator;
  readonly partnerConvictedOfACrimeDetailsText: Locator;
  readonly partnerConvictedOfACrimeDetailsInput: Locator;
  readonly partnerConvictedOfACrimeDetailsInfo: Locator;
  readonly partnerConvictedOfACrimeNoLabel: Locator;
  readonly partnerCrimeBackNavBtn: Locator;
  readonly partnerConvictedOfACrimeMainError: Locator;
  readonly partnerConvictedOfACrimeSubError: Locator;
  readonly partnerConvictedOfACrimeDetailsMainError: Locator;
  readonly partnerConvictedOfACrimeDetailsSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.partnerConvictedOfACrimeText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.partnerConvictedOfACrimeLabel = page.locator('div#gov-grid-row-content>div>form>p').first();
    this.partnerConvictedOfACrimeYesLabel = page.locator("label[for='convictedJoint-yes']").first();
    this.partnerConvictedOfACrimeDetailsText = page.locator("label[for='detailsOfCrimeJoint']").first();
    this.partnerConvictedOfACrimeDetailsInput = page.locator('textarea#detailsOfCrimeJoint').first();
    this.partnerConvictedOfACrimeDetailsInfo = page.locator('div#detailsOfCrimeJoint-info').first();
    this.partnerConvictedOfACrimeNoLabel = page.locator("label[for='convictedJoint-no']").first();
    this.partnerCrimeBackNavBtn = page.locator("a[href='/apply/partner-other-names']").first();
    this.partnerConvictedOfACrimeMainError = page.locator("a[href='#convictedJoint-yes']").first();
    this.partnerConvictedOfACrimeSubError = page.locator('p#convictedJoint-error').first();
    this.partnerConvictedOfACrimeDetailsMainError = page.locator("a[href='#detailsOfCrimeJoint']").first();
    this.partnerConvictedOfACrimeDetailsSubError = page.locator('p#detailsOfCrimeJoint-error').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Have you or your partner ever been convicted of a crime in the UK? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validatePartnerConvictedOfACrimePageContent(): Promise<void> {
    await expect(this.partnerCrimeBackNavBtn).toBeVisible();
    await expect(this.partnerConvictedOfACrimeText).toHaveText(
      'Have you or your partner ever been convicted of a crime in the UK?',
    );
    await expect(this.partnerConvictedOfACrimeLabel).toHaveText(
      'Some crimes could affect your application, but we won\u2019t use this information for anything else.',
    );
    await expect(this.partnerConvictedOfACrimeYesLabel).toHaveText('Yes');
    await this.partnerConvictedOfACrimeYesLabel.click();
    await expect(this.partnerConvictedOfACrimeDetailsText).toHaveText('Enter details of the crime(s)');
    await expect(this.partnerConvictedOfACrimeDetailsInfo).toHaveText('You have 500 characters remaining');
    await expect(this.partnerConvictedOfACrimeNoLabel).toHaveText('No');
  }
  async validatePartnerConvictedOfACrimePageErrors(): Promise<void> {
    await expect(this.partnerCrimeBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.partnerConvictedOfACrimeMainError).toHaveText(
      'Select if you or your partner have ever been convicted of a crime in the UK',
    );
    await expect(this.partnerConvictedOfACrimeSubError).toContainText(
      'Select if you or your partner have ever been convicted of a crime in the UK',
    );
    await this.partnerConvictedOfACrimeYesLabel.click();
    await this.clickContinue();
    await expect(this.partnerConvictedOfACrimeDetailsMainError).toHaveText('Enter details of the crime(s)');
    await expect(this.partnerConvictedOfACrimeDetailsSubError).toContainText('Enter details of the crime(s)');
    await this.clearAndEnterTextInElement(this.partnerConvictedOfACrimeDetailsInput, ConstantsLib.CRIME_DETAILS);
    await this.clickContinue();
  }
  async completePartnerConvictedOfACrimePage(option: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.completeRadioPage(option);
  }
}
