import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
import { ConstantsLib } from '../utility-helper/constants-lib';
export class RilNationalInsuranceNumberPage extends basePage {
  readonly niNumberHeaderText: Locator;
  readonly niNumberText: Locator;
  readonly niCardText: Locator;
  readonly benefitLettersText: Locator;
  readonly payslipsText: Locator;
  readonly p60sText: Locator;
  readonly backOfYourBRPText: Locator;
  readonly yourNINumberText: Locator;
  readonly yourNINumberExampleText: Locator;
  readonly niNumberInput: Locator;
  readonly niNumberBackNavBtn: Locator;
  readonly niNumberMainError: Locator;
  readonly niNumberSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.niNumberHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.niNumberText = page.locator('div#gov-grid-row-content>div>form>p').first();
    this.niCardText = page.locator('div#gov-grid-row-content>div>form>ul>li:nth-of-type(1)').first();
    this.benefitLettersText = page.locator('div#gov-grid-row-content>div>form>ul>li:nth-of-type(2)').first();
    this.payslipsText = page.locator('div#gov-grid-row-content>div>form>ul>li:nth-of-type(3)').first();
    this.p60sText = page.locator('div#gov-grid-row-content>div>form>ul>li:nth-of-type(4)').first();
    this.backOfYourBRPText = page.locator('div#gov-grid-row-content>div>form>ul>li:nth-of-type(5)').first();
    this.yourNINumberText = page.locator('div#niNumber-group>label').first();
    this.yourNINumberExampleText = this.hintLocator('span#niNumber-hint');
    this.niNumberInput = page.locator('input#niNumber').first();
    this.niNumberBackNavBtn = page.locator("a[href='/apply/brp']").first();
    this.niNumberMainError = page.locator("a[href='#niNumber']").first();
    this.niNumberSubError = page.locator('div#niNumber-group>p').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'National Insurance number – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateNationalInsuranceNumberPageContent(): Promise<void> {
    await expect(this.niNumberBackNavBtn).toBeVisible();
    await expect(this.niNumberHeaderText).toHaveText('National Insurance number');
    await expect(this.niNumberText).toHaveText('You can find your National Insurance number:');
    await expect(this.niCardText).toHaveText('on your National Insurance card');
    await expect(this.benefitLettersText).toHaveText('benefit letters');
    await expect(this.payslipsText).toHaveText('payslips');
    await expect(this.p60sText).toHaveText('P60s');
    await expect(this.backOfYourBRPText).toHaveText('on the back of your biometric residence permit');
    await expect(this.yourNINumberText).toHaveText('What is your National Insurance number?');
    await expect(this.yourNINumberExampleText).toHaveText('For example, \u2018QQ 12 34 56 C\u2019');
  }
  async validateNationalInsuranceNumberPageErrors(): Promise<void> {
    await expect(this.niNumberBackNavBtn).toBeVisible();
    await this.getContinueButton();
    await this.clickContinue();
    await expect(this.niNumberMainError).toHaveText(
      "Enter your National Insurance number in the correct format; for example, 'QQ 12 34 56 C'",
    );
    await expect(this.niNumberSubError).toContainText(
      "Enter your National Insurance number in the correct format; for example, 'QQ 12 34 56 C'",
    );
    await expect(this.niNumberBackNavBtn).toBeVisible();
    await this.clearAndEnterTextInElement(this.niNumberInput, ConstantsLib.SHORT_NI_NUMBER);
    await this.clickContinue();
    await expect(this.niNumberMainError).toHaveText(
      "Enter your National Insurance number in the correct format; for example, 'QQ 12 34 56 C'",
    );
    await expect(this.niNumberSubError).toContainText(
      "Enter your National Insurance number in the correct format; for example, 'QQ 12 34 56 C'",
    );
    await expect(this.niNumberBackNavBtn).toBeVisible();
    await this.clearAndEnterTextInElement(this.niNumberInput, ConstantsLib.NI_NUMBER_WRONG_ORDER);
    await this.clickContinue();
    await expect(this.niNumberMainError).toHaveText(
      "Enter your National Insurance number in the correct format; for example, 'QQ 12 34 56 C'",
    );
    await expect(this.niNumberSubError).toContainText(
      "Enter your National Insurance number in the correct format; for example, 'QQ 12 34 56 C'",
    );
    await expect(this.niNumberBackNavBtn).toBeVisible();
    await this.clearAndEnterTextInElement(this.niNumberInput, ConstantsLib.LONG_NI_NUMBER);
    await this.clickContinue();
    await expect(this.niNumberMainError).toHaveText(
      "Enter your National Insurance number in the correct format; for example, 'QQ 12 34 56 C'",
    );
    await expect(this.niNumberSubError).toContainText(
      "Enter your National Insurance number in the correct format; for example, 'QQ 12 34 56 C'",
    );
  }
  async completeNationalInsuranceNumberPage(value: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.completeTextPage(this.niNumberInput, value);
  }
}
