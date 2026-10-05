import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
import { ConstantsLib } from '../utility-helper/constants-lib';
export class RilBankOrBuildingSocietyAccountPage extends basePage {
  readonly bankAccountHeaderText: Locator;
  readonly sendYourLoanText: Locator;
  readonly nameOnTheAccountLabel: Locator;
  readonly nameOnTheAccountInput: Locator;
  readonly buildSocietyLabel: Locator;
  readonly buildSocietyInput: Locator;
  readonly sortCodeLabel: Locator;
  readonly sortCodeHintText: Locator;
  readonly sortCodeInput: Locator;
  readonly accountNumberLabel: Locator;
  readonly accountNumberHintLabel: Locator;
  readonly accountNumberInput: Locator;
  readonly creditUnionNumberLabel: Locator;
  readonly creditUnionNumberHintLabel: Locator;
  readonly creditUnionNumberInput: Locator;
  readonly bankAccountBackNavBtn: Locator;
  readonly accountNameMainError: Locator;
  readonly accountNameSubError: Locator;
  readonly bankNameMainError: Locator;
  readonly bankNameSubError: Locator;
  readonly sortCodeMainError: Locator;
  readonly sortCodeSubError: Locator;
  readonly accountNumberMainError: Locator;
  readonly accountNumberSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.bankAccountHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.sendYourLoanText = page.locator('div#gov-grid-row-content>div>form>p').first();
    this.nameOnTheAccountLabel = page.locator("label[for='accountName']").first();
    this.nameOnTheAccountInput = page.locator('input#accountName').first();
    this.buildSocietyLabel = page.locator("label[for='bankName']").first();
    this.buildSocietyInput = page.locator('input#bankName').first();
    this.sortCodeLabel = page.locator("label[for='sortCode']").first();
    this.sortCodeHintText = this.hintLocator('span#sortCode-hint');
    this.sortCodeInput = page.locator('input#sortCode').first();
    this.accountNumberLabel = page.locator("label[for='accountNumber']").first();
    this.accountNumberHintLabel = this.hintLocator('span#accountNumber-hint');
    this.accountNumberInput = page.locator('input#accountNumber').first();
    this.creditUnionNumberLabel = page.locator("label[for='rollNumber']").first();
    this.creditUnionNumberHintLabel = this.hintLocator('span#rollNumber-hint');
    this.creditUnionNumberInput = page.locator('input#rollNumber').first();
    this.bankAccountBackNavBtn = page.locator("a[href='/apply/purpose']").first();
    this.accountNameMainError = page.locator("a[href='#accountName']").first();
    this.accountNameSubError = page.locator('div#accountName-group>p').first();
    this.bankNameMainError = page.locator("a[href='#bankName']").first();
    this.bankNameSubError = page.locator('div#bankName-group>p').first();
    this.sortCodeMainError = page.locator("a[href='#sortCode']").first();
    this.sortCodeSubError = page.locator('div#sortCode-group>p').first();
    this.accountNumberMainError = page.locator("a[href='#accountNumber']").first();
    this.accountNumberSubError = page.locator('div#accountNumber-group>p').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'What are your bank or building society account details? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateBankOrBuildingSocietyPageContent(): Promise<void> {
    await expect(this.bankAccountBackNavBtn).toBeVisible();
    await expect(this.bankAccountHeaderText).toHaveText('What are your bank or building society account details?');
    await expect(this.sendYourLoanText).toHaveText('We will send your loan to this account.');
    await expect(this.nameOnTheAccountLabel).toHaveText('Name on the account');
    await expect(this.buildSocietyLabel).toHaveText('Name of your bank or building society');
    await expect(this.sortCodeLabel).toHaveText('Sort code');
    await expect(this.sortCodeHintText).toHaveText('Must be 6 digits long');
    await expect(this.accountNumberLabel).toHaveText('Account number');
    await expect(this.accountNumberHintLabel).toHaveText('Must be between 6 and 8 digits long');
    await expect(this.creditUnionNumberLabel).toHaveText('Building society or credit union number (if you have one)');
    await expect(this.creditUnionNumberHintLabel).toHaveText('You can find this on your card, statement or passbook');
  }
  async validateBankOrBuildingSocietyPageErrors(): Promise<void> {
    await expect(this.bankAccountBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.accountNameMainError).toHaveText('Enter the name on your account');
    await expect(this.accountNameSubError).toContainText('Enter the name on your account');
    await expect(this.bankNameMainError).toHaveText('Enter the name of your bank or building society');
    await expect(this.bankNameSubError).toContainText('Enter the name of your bank or building society');
    await expect(this.sortCodeMainError).toHaveText('Enter your sort code in the correct format; for example 010101');
    await expect(this.sortCodeSubError).toContainText('Enter your sort code in the correct format; for example 010101');
    await expect(this.accountNumberMainError).toHaveText('Enter your 6 to 8 digit account number');
    await expect(this.accountNumberSubError).toContainText('Enter your 6 to 8 digit account number');
    await this.enterBankOrBuildingSocietyDetails(
      ConstantsLib.BANK_VALIDATION_ACCOUNT_NAME,
      ConstantsLib.INPUT_LOAN_AMOUNT,
      ConstantsLib.SHORT_SORT_CODE,
      ConstantsLib.SHORT_ACCOUNT_NUMBER,
      ConstantsLib.INPUT_LOAN_AMOUNT,
    );
    await expect(this.sortCodeMainError).toHaveText('Enter your sort code in the correct format; for example 010101');
    await expect(this.sortCodeSubError).toContainText('Enter your sort code in the correct format; for example 010101');
    await expect(this.accountNumberMainError).toHaveText('Enter your 6 to 8 digit account number');
    await expect(this.accountNumberSubError).toContainText('Enter your 6 to 8 digit account number');
    await this.enterBankOrBuildingSocietyDetails(
      ConstantsLib.BANK_VALIDATION_ACCOUNT_NAME,
      ConstantsLib.INPUT_LOAN_AMOUNT,
      ConstantsLib.LONG_SORT_CODE,
      ConstantsLib.LONG_ACCOUNT_NUMBER,
      ConstantsLib.INPUT_LOAN_AMOUNT,
    );
    await expect(this.sortCodeMainError).toHaveText('Enter your sort code in the correct format; for example 010101');
    await expect(this.sortCodeSubError).toContainText('Enter your sort code in the correct format; for example 010101');
    await this.enterBankOrBuildingSocietyDetails(
      ConstantsLib.ACCOUNT_NAME,
      ConstantsLib.INPUT_LOAN_AMOUNT,
      ConstantsLib.SORT_CODE_WITH_SYMBOL,
      ConstantsLib.ACCOUNT_NUMBER_WITH_SYMBOL,
      ConstantsLib.INPUT_LOAN_AMOUNT,
    );
    await expect(this.sortCodeMainError).toHaveText('Enter your sort code in the correct format; for example 010101');
    await expect(this.sortCodeSubError).toContainText('Enter your sort code in the correct format; for example 010101');
    await expect(this.accountNumberMainError).toHaveText('Enter your 6 to 8 digit account number');
    await expect(this.accountNumberSubError).toContainText('Enter your 6 to 8 digit account number');
    await this.enterBankOrBuildingSocietyDetails(
      ConstantsLib.ACCOUNT_NAME,
      ConstantsLib.INPUT_LOAN_AMOUNT,
      ConstantsLib.SORT_CODE_WITH_LETTERS,
      ConstantsLib.ACCOUNT_NUMBER_WITH_LETTERS,
      ConstantsLib.INPUT_LOAN_AMOUNT,
    );
    await expect(this.sortCodeMainError).toHaveText('Enter your sort code in the correct format; for example 010101');
    await expect(this.sortCodeSubError).toContainText('Enter your sort code in the correct format; for example 010101');
    await expect(this.accountNumberMainError).toHaveText('Enter your 6 to 8 digit account number');
    await expect(this.accountNumberSubError).toContainText('Enter your 6 to 8 digit account number');
  }
  async enterBankOrBuildingSocietyDetails(
    name: string,
    building: string,
    sortcode: string,
    account: string,
    creditUnionNumber: string,
  ): Promise<void> {
    await this.getContinueButton();
    await this.clearAndEnterTextInElement(this.nameOnTheAccountInput, name);
    await this.clearAndEnterTextInElement(this.buildSocietyInput, building);
    await this.clearAndEnterTextInElement(this.sortCodeInput, sortcode);
    await this.clearAndEnterTextInElement(this.accountNumberInput, account);
    await this.clearAndEnterTextInElement(this.creditUnionNumberInput, creditUnionNumber);
    await this.clickContinue();
  }
}
