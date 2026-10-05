import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
import { PageInputValues } from '../test-data/page-input-values';
export class RilPartnerBRPDetailsPage extends basePage {
  readonly brpNumberPageHeaderText: Locator;
  readonly brpNumberEnterYourDetailsText: Locator;
  readonly brpNumberText: Locator;
  readonly brpNumberExampleText: Locator;
  readonly brpNumberInput: Locator;
  readonly findYourBrpNumberLink: Locator;
  readonly findYourBrpNumberLinkHint: Locator;
  readonly findYourBrpNumberLinkImg: Locator;
  readonly fullnameLabel: Locator;
  readonly fullnameInput: Locator;
  readonly dobLabel: Locator;
  readonly dobPanelHintText: Locator;
  readonly dayLabel: Locator;
  readonly monthLabel: Locator;
  readonly yearLabel: Locator;
  readonly brpBackNavBtn: Locator;
  readonly brpNumberFormatMainError: Locator;
  readonly brpNumberFormatSubError: Locator;
  readonly fullNameMainError: Locator;
  readonly fullNameSubError: Locator;
  readonly dobMainError: Locator;
  readonly dobSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.brpNumberPageHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.brpNumberEnterYourDetailsText = page.locator('div#gov-grid-row-content>div>form>p').first();
    this.brpNumberText = page.locator("label[for='partnerBrpNumber']").first();
    this.brpNumberExampleText = this.hintLocator('span#partnerBrpNumber-hint');
    this.brpNumberInput = page.locator('input#partnerBrpNumber').first();
    this.findYourBrpNumberLink = page.locator("summary[class='govuk-details__summary']").first();
    this.findYourBrpNumberLinkHint = page.locator('div#details-content-0>p:nth-of-type(1)').first();
    this.findYourBrpNumberLinkImg = page.locator("img[src='/public/images/card-example-xsmall.png']").first();
    this.fullnameLabel = page.locator("label[for='partnerFullName']").first();
    this.fullnameInput = page.locator('input#partnerFullName').first();
    this.dobLabel = page.locator('fieldset#partnerDateOfBirth-group>legend').first();
    this.dobPanelHintText = this.hintLocator('span#partnerDateOfBirth-hint');
    this.dayLabel = page.locator("label[for='partnerDateOfBirth-day']").first();
    this.monthLabel = page.locator("label[for='partnerDateOfBirth-month']").first();
    this.yearLabel = page.locator("label[for='partnerDateOfBirth-year']").first();
    this.brpBackNavBtn = page.locator("a[href='/apply/home-office-reference']").first();
    this.brpNumberFormatMainError = page.locator("a[href='#partnerBrpNumber']").first();
    this.brpNumberFormatSubError = page.locator('div#partnerBrpNumber-group>p').first();
    this.fullNameMainError = page.locator("a[href='#partnerFullName']").first();
    this.fullNameSubError = page.locator('div#partnerFullName-group>p').first();
    this.dobMainError = page.locator("a[href='#partnerDateOfBirth-day']").first();
    this.dobSubError = page.locator('p#partnerDateOfBirth-error').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Your partner\u2019s biometric residence permit details – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validatePartnerBRPDetailsContent(): Promise<void> {
    await this.getContinueButton();
    await expect(this.brpNumberPageHeaderText).toHaveText('Your partner\u2019s biometric residence permit details');
    await expect(this.brpNumberEnterYourDetailsText).toHaveText(
      'If you have a biometric residence permit (BRP), enter your details as they appear on the card. You can still use details from expired BRP cards.',
    );
    await expect(this.brpNumberText).toHaveText('BRP number (optional)');
    await expect(this.brpNumberExampleText).toHaveText('For example, \u2018ZUX123456 or ZU1234567\u2019.');
    await expect(this.findYourBrpNumberLink).toHaveText('Where to find your BRP number');
    await this.findYourBrpNumberLink.click();
    await expect(this.brpBackNavBtn).toBeVisible();
    await this.getContinueButton();
    await expect(this.findYourBrpNumberLinkHint).toHaveText(
      'BRP numbers are on the top right hand corner of the card, on the same side as the personal information.',
    );
    await expect(this.findYourBrpNumberLinkImg).toBeVisible();
    await expect(this.fullnameLabel).toHaveText('Full name');
    await expect(this.dobLabel).toHaveText('Date of Birth');
    await expect(this.dobPanelHintText).toHaveText('For example, 31 3 1980');
    await expect(this.dayLabel).toHaveText('Day');
    await expect(this.monthLabel).toHaveText('Month');
    await expect(this.yearLabel).toHaveText('Year');
  }
  async validatePartnerBRPDetailsErrors(values: PageInputValues): Promise<void> {
    await this.getContinueButton();
    await this.clickContinue();
    await expect(this.fullNameMainError).toHaveText("Enter your partner's full name");
    await expect(this.fullNameSubError).toContainText("Enter your partner's full name");
    await expect(this.dobMainError).toHaveText(
      "Enter your partner's date of birth in the correct format; for example, 31 3 1980",
    );
    await expect(this.dobSubError).toContainText(
      "Enter your partner's date of birth in the correct format; for example, 31 3 1980",
    );
    await this.enterPartnerBRPDetails(values.brpWithSpace, values.invalidDataFullName, values.invalidDayAndMonth);
    await expect(this.brpNumberFormatMainError).toHaveText(
      "Enter your partner's BRP number in the correct format; for example, \u2018ZUX123456 or ZU1234567\u2019",
    );
    await expect(this.brpNumberFormatSubError).toContainText(
      "Enter your partner's BRP number in the correct format; for example, \u2018ZUX123456 or ZU1234567\u2019",
    );
    await expect(this.dobMainError).toHaveText(
      "Enter your partner's date of birth in the correct format; for example, 31 3 1980",
    );
    await expect(this.dobSubError).toContainText(
      "Enter your partner's date of birth in the correct format; for example, 31 3 1980",
    );
    await this.enterPartnerBRPDetails(values.brpWithSpace, values.invalidDataFullName, values.invalidDayAndMonth);
    await expect(this.brpNumberFormatMainError).toHaveText(
      "Enter your partner's BRP number in the correct format; for example, \u2018ZUX123456 or ZU1234567\u2019",
    );
    await expect(this.brpNumberFormatSubError).toContainText(
      "Enter your partner's BRP number in the correct format; for example, \u2018ZUX123456 or ZU1234567\u2019",
    );
    await expect(this.dobMainError).toHaveText(
      "Enter your partner's date of birth in the correct format; for example, 31 3 1980",
    );
    await expect(this.dobSubError).toContainText(
      "Enter your partner's date of birth in the correct format; for example, 31 3 1980",
    );
  }
  async enterPartnerBRPDetails(brpNumber: string, fullName: string, dob: string): Promise<void> {
    await this.getContinueButton();
    await this.clearAndEnterTextInElement(this.brpNumberInput, brpNumber);
    await this.clearAndEnterTextInElement(this.fullnameInput, fullName);
    await this.enterDateOrDob(dob);
    await this.clickContinue();
  }
}
