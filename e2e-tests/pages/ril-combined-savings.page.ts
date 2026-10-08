import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
import { ConstantsLib } from '../utility-helper/constants-lib';
export class RilCombinedSavingsPage extends basePage {
  readonly combinedAmountOfSavingsHeaderText: Locator;
  readonly combinedAmountOfSavingsYesLabel: Locator;
  readonly combinedTotalAmountOfSavingsLabel: Locator;
  readonly combinedTotalAmountOfSavingsInput: Locator;
  readonly combinedAmountOfSavingsNoLabel: Locator;
  readonly combinedAmountOfSavingsBackNavBtn: Locator;
  readonly combinedAmountOfSavingsMainError: Locator;
  readonly combinedAmountOfSavingsSubError: Locator;
  readonly combinedSavingsMainError: Locator;
  readonly combinedSavingsSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.combinedAmountOfSavingsHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.combinedAmountOfSavingsYesLabel = page.locator("label[for='combinedSavings-yes']").first();
    this.combinedTotalAmountOfSavingsLabel = page.locator("label[for='combinedSavingsAmount']").first();
    this.combinedTotalAmountOfSavingsInput = page.locator('input#combinedSavingsAmount').first();
    this.combinedAmountOfSavingsNoLabel = page.locator("label[for='combinedSavings-no']").first();
    this.combinedAmountOfSavingsBackNavBtn = page.locator("a[href='/apply/combined-outgoings']").first();
    this.combinedAmountOfSavingsMainError = page.locator("a[href='#combinedSavings-yes']").first();
    this.combinedAmountOfSavingsSubError = page.locator('p#combinedSavings-error').first();
    this.combinedSavingsMainError = page.locator("a[href='#combinedSavingsAmount']").first();
    this.combinedSavingsSubError = page.locator('div#combinedSavingsAmount-group>p').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Do you or your partner have any savings? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateCombinedHaveAnySavingsPageContent(): Promise<void> {
    await expect(this.combinedAmountOfSavingsBackNavBtn).toBeVisible();
    await expect(this.combinedAmountOfSavingsHeaderText).toHaveText('Do you or your partner have any savings?');
    await expect(this.combinedAmountOfSavingsYesLabel).toHaveText('Yes');
    await this.combinedAmountOfSavingsYesLabel.click();
    await expect(this.combinedTotalAmountOfSavingsLabel).toHaveText('Total amount of savings');
    await expect(this.combinedAmountOfSavingsNoLabel).toHaveText('No');
  }
  async validateCombinedHaveAnySavingsPageErrors(): Promise<void> {
    await expect(this.combinedAmountOfSavingsBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.combinedAmountOfSavingsMainError).toHaveText('Select if you or your partner have any savings');
    await expect(this.combinedAmountOfSavingsSubError).toContainText('Select if you or your partner have any savings');
    await this.combinedAmountOfSavingsYesLabel.click();
    await this.clickContinue();
    await expect(this.combinedSavingsMainError).toHaveText('Enter total amount of savings');
    await expect(this.combinedSavingsSubError).toContainText('Enter total amount of savings');
    await this.clearAndEnterTextInElement(this.combinedTotalAmountOfSavingsInput, ConstantsLib.ZERO_AMOUNT);
    await this.clickContinue();
    await expect(this.combinedSavingsMainError).toHaveText('Total amount of savings must be greater than zero');
    await expect(this.combinedSavingsSubError).toContainText('Total amount of savings must be greater than zero');
    await this.clearAndEnterTextInElement(this.combinedTotalAmountOfSavingsInput, ConstantsLib.NEGATIVE_AMOUNT);
    await this.clickContinue();
    await expect(this.combinedSavingsMainError).toHaveText('Total amount of savings must be greater than zero');
    await expect(this.combinedSavingsSubError).toContainText('Total amount of savings must be greater than zero');
    await this.clearAndEnterTextInElement(this.combinedTotalAmountOfSavingsInput, ConstantsLib.CURRENCY_SYMBOL_AMOUNT);
    await this.clickContinue();
    await expect(this.combinedSavingsMainError).toHaveText('Total amount of savings must be in pounds and pence; for example £100.00');
    await expect(this.combinedSavingsSubError).toContainText('Total amount of savings must be in pounds and pence; for example £100.00');
    await this.clearAndEnterTextInElement(this.combinedTotalAmountOfSavingsInput, ConstantsLib.THREE_DECIMAL_AMOUNT);
    await this.clickContinue();
    await expect(this.combinedSavingsMainError).toHaveText('Total amount of savings must be in pounds and pence; for example £100.00');
    await expect(this.combinedSavingsSubError).toContainText('Total amount of savings must be in pounds and pence; for example £100.00');
    await this.combinedAmountOfSavingsYesLabel.click();
  }
  
  async completeCombinedSavingsPage(option: string, amount: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.getJavascriptCheckBox(option).click();
    if (await this.combinedTotalAmountOfSavingsInput.isVisible())
      await this.type(this.combinedTotalAmountOfSavingsInput, amount);
    await this.clickContinueButton();
  }
}
