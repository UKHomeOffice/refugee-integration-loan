import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
import { ConstantsLib } from '../utility-helper/constants-lib';
export class RilPartnerNINumberPage extends basePage {
  readonly partnerNINumberHeaderText: Locator;
  readonly partnerNINumberText: Locator;
  readonly partnerNICardText: Locator;
  readonly partnerBenefitLettersText: Locator;
  readonly partnerPayslipsText: Locator;
  readonly partnerP60sText: Locator;
  readonly partnerBackOfYourBRPText: Locator;
  readonly partnerYourNINumberText: Locator;
  readonly partnerYourNINumberExampleText: Locator;
  readonly partnerNINumberInput: Locator;
  readonly partnerNINumberBackNavBtn: Locator;
  readonly partnerNINumberMainError: Locator;
  readonly partnerNINumberSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.partnerNINumberHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.partnerNINumberText = page.locator('div#gov-grid-row-content>div>form>p').first();
    this.partnerNICardText = page.locator('div#gov-grid-row-content>div>form>ul>li:nth-of-type(1)').first();
    this.partnerBenefitLettersText = page.locator('div#gov-grid-row-content>div>form>ul>li:nth-of-type(2)').first();
    this.partnerPayslipsText = page.locator('div#gov-grid-row-content>div>form>ul>li:nth-of-type(3)').first();
    this.partnerP60sText = page.locator('div#gov-grid-row-content>div>form>ul>li:nth-of-type(4)').first();
    this.partnerBackOfYourBRPText = page.locator('div#gov-grid-row-content>div>form>ul>li:nth-of-type(5)').first();
    this.partnerYourNINumberText = page.locator("label[for='partnerNiNumber']").first();
    this.partnerYourNINumberExampleText = this.hintLocator('span#partnerNiNumber-hint');
    this.partnerNINumberInput = page.locator('input#partnerNiNumber').first();
    this.partnerNINumberBackNavBtn = page.locator("a[href='/apply/partner-brp']").first();
    this.partnerNINumberMainError = page.locator("a[href='#partnerNiNumber']").first();
    this.partnerNINumberSubError = page.locator('div#partnerNiNumber-group>p').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Your partner\u2019s National Insurance number – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validatePartnerNINumberPageContent(): Promise<void> {
    await expect(this.partnerNINumberBackNavBtn).toBeVisible();
    await expect(this.partnerNINumberHeaderText).toHaveText('Your partner\u2019s National Insurance number');
    await expect(this.partnerNINumberText).toHaveText('You can find your partner\u2019s National Insurance number:');
    await expect(this.partnerNICardText).toHaveText('on your National Insurance card');
    await expect(this.partnerBenefitLettersText).toHaveText('benefit letters');
    await expect(this.partnerPayslipsText).toHaveText('payslips');
    await expect(this.partnerP60sText).toHaveText('P60s');
    await expect(this.partnerBackOfYourBRPText).toHaveText('on the back of your biometric residence permit');
    await expect(this.partnerYourNINumberText).toHaveText('What is your partner\u2019s National Insurance number?');
    await expect(this.partnerYourNINumberExampleText).toHaveText('For example, \u2018QQ 12 34 56 C\u2019');
  }
  async validatePartnerNINumberPageErrors(): Promise<void> {
    await expect(this.partnerNINumberBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.partnerNINumberMainError).toHaveText(
      "Enter your partner's National Insurance number in the correct format; for example, 'QQ 12 34 56 C'",
    );
    await expect(this.partnerNINumberSubError).toContainText(
      "Enter your partner's National Insurance number in the correct format; for example, 'QQ 12 34 56 C'",
    );
    await this.enterPartnerNINumber(ConstantsLib.SHORT_NI_NUMBER);
    await expect(this.partnerNINumberMainError).toHaveText(
      "Enter your partner's National Insurance number in the correct format; for example, 'QQ 12 34 56 C'",
    );
    await expect(this.partnerNINumberSubError).toContainText(
      "Enter your partner's National Insurance number in the correct format; for example, 'QQ 12 34 56 C'",
    );
    await this.enterPartnerNINumber(ConstantsLib.NI_NUMBER_WRONG_ORDER);
    await expect(this.partnerNINumberMainError).toHaveText(
      "Enter your partner's National Insurance number in the correct format; for example, 'QQ 12 34 56 C'",
    );
    await expect(this.partnerNINumberSubError).toContainText(
      "Enter your partner's National Insurance number in the correct format; for example, 'QQ 12 34 56 C'",
    );
    await this.enterPartnerNINumber(ConstantsLib.LONG_NI_NUMBER);
    await expect(this.partnerNINumberMainError).toHaveText(
      "Enter your partner's National Insurance number in the correct format; for example, 'QQ 12 34 56 C'",
    );
    await expect(this.partnerNINumberSubError).toContainText(
      "Enter your partner's National Insurance number in the correct format; for example, 'QQ 12 34 56 C'",
    );
  }
  async enterPartnerNINumber(niNumber: string): Promise<void> {
    await this.getContinueButton();
    await this.clearAndEnterTextInElement(this.partnerNINumberInput, niNumber);
    await this.clickContinue();
  }
}
