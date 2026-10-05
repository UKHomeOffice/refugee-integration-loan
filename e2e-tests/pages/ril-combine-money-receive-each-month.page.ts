import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
import { PageInputValues } from '../test-data/page-input-values';
export class RilCombineMoneyReceiveEachMonthPage extends basePage {
  readonly combinedMoneyReceiveEachMonthHeaderText: Locator;
  readonly combinedSelectAllOptionsText: Locator;
  readonly combinedSalaryBeforeTaxLabel: Locator;
  readonly combinedTotalSalaryLabel: Locator;
  readonly combinedTotalSalaryInput: Locator;
  readonly combinedUCText: Locator;
  readonly combinedUCAmountHintText: Locator;
  readonly combinedTotalUCText: Locator;
  readonly combinedTotalUCInput: Locator;
  readonly combinedCBLabel: Locator;
  readonly combinedTotalChildBenefitText: Locator;
  readonly combinedTotalChildBenefitInput: Locator;
  readonly combinedHBLabel: Locator;
  readonly combinedTotalHousingBenefitText: Locator;
  readonly combinedTotalHousingBenefitInput: Locator;
  readonly combinedOtherLabel: Locator;
  readonly combinedTotalOtherIncomeText: Locator;
  readonly combinedTotalOtherIncomeInput: Locator;
  readonly combinedOtherIncomeExplanationText: Locator;
  readonly combinedPleaseSpecifyText: Locator;
  readonly combinedPleaseSpecifyInput: Locator;
  readonly combinedCharactersRemainingText: Locator;
  readonly combinedMoneyReceivedBackNavBtn: Locator;
  readonly combinedMoneyReceiveOptionMainError: Locator;
  readonly combinedMoneyReceiveOptionSubError: Locator;
  readonly combinedSalaryMainError: Locator;
  readonly combinedSalarySubError: Locator;
  readonly combinedUniversalCreditMainError: Locator;
  readonly combinedUniversalCreditSubError: Locator;
  readonly combinedChildBenefitMainError: Locator;
  readonly combinedChildBenefitSubError: Locator;
  readonly combinedHousingBenefitMainError: Locator;
  readonly combinedHousingBenefitSubError: Locator;
  readonly combinedOtherIncomeMainError: Locator;
  readonly combinedOtherIncomeSubError: Locator;
  readonly combinedOtherIncomeDetailsMainError: Locator;
  readonly combinedOtherIncomeDetailsSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.combinedMoneyReceiveEachMonthHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.combinedSelectAllOptionsText = page.locator('div#combinedIncomeTypes-hint').first();
    this.combinedSalaryBeforeTaxLabel = page.locator("label[for='combinedIncomeTypes-salary']").first();
    this.combinedTotalSalaryLabel = page.locator("label[for='combinedSalaryAmount']").first();
    this.combinedTotalSalaryInput = page.locator('input#combinedSalaryAmount').first();
    this.combinedUCText = page.locator("label[for='combinedIncomeTypes-universal_credit']").first();
    this.combinedUCAmountHintText = page.locator('div#combinedIncomeTypes-universal_credit-item-hint').first();
    this.combinedTotalUCText = page.locator("label[for='combinedUniversalCreditAmount']").first();
    this.combinedTotalUCInput = page.locator('input#combinedUniversalCreditAmount').first();
    this.combinedCBLabel = page.locator("label[for='combinedIncomeTypes-child_benefit']").first();
    this.combinedTotalChildBenefitText = page.locator("label[for='combinedChildBenefitAmount']").first();
    this.combinedTotalChildBenefitInput = page.locator('input#combinedChildBenefitAmount').first();
    this.combinedHBLabel = page.locator("label[for='combinedIncomeTypes-housing_benefit']").first();
    this.combinedTotalHousingBenefitText = page.locator("label[for='combinedHousingBenefitAmount']").first();
    this.combinedTotalHousingBenefitInput = page.locator('input#combinedHousingBenefitAmount').first();
    this.combinedOtherLabel = page.locator("label[for='combinedIncomeTypes-other']").first();
    this.combinedTotalOtherIncomeText = page.locator("label[for='combinedOtherIncomeAmount']").first();
    this.combinedTotalOtherIncomeInput = page.locator('input#combinedOtherIncomeAmount').first();
    this.combinedOtherIncomeExplanationText = page.locator("label[for='combinedOtherIncomeExplain']").first();
    this.combinedPleaseSpecifyText = page.locator('div#combinedOtherIncomeExplain-hint').first();
    this.combinedPleaseSpecifyInput = page.locator('textarea#combinedOtherIncomeExplain').first();
    this.combinedCharactersRemainingText = page.locator('div#combinedOtherIncomeExplain-info').first();
    this.combinedMoneyReceivedBackNavBtn = page.locator("a[href='/apply/address']").first();
    this.combinedMoneyReceiveOptionMainError = page.locator("a[href='#combinedIncomeTypes-salary']").first();
    this.combinedMoneyReceiveOptionSubError = page.locator('p#combinedIncomeTypes-error').first();
    this.combinedSalaryMainError = page.locator("a[href='#combinedSalaryAmount']").first();
    this.combinedSalarySubError = page.locator('div#combinedSalaryAmount-group>p').first();
    this.combinedUniversalCreditMainError = page.locator("a[href='#combinedUniversalCreditAmount']").first();
    this.combinedUniversalCreditSubError = page.locator('div#combinedUniversalCreditAmount-group>p').first();
    this.combinedChildBenefitMainError = page.locator("a[href='#combinedChildBenefitAmount']").first();
    this.combinedChildBenefitSubError = page.locator('div#combinedChildBenefitAmount-group>p').first();
    this.combinedHousingBenefitMainError = page.locator("a[href='#combinedHousingBenefitAmount']").first();
    this.combinedHousingBenefitSubError = page.locator('div#combinedHousingBenefitAmount-group>p').first();
    this.combinedOtherIncomeMainError = page.locator("a[href='#combinedOtherIncomeAmount']").first();
    this.combinedOtherIncomeSubError = page.locator('div#combinedOtherIncomeAmount-group>p').first();
    this.combinedOtherIncomeDetailsMainError = page.locator("a[href='#combinedOtherIncomeExplain']").first();
    this.combinedOtherIncomeDetailsSubError = page.locator('p#combinedOtherIncomeExplain-error').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'You and your partner\u2019s combined monthly income – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateCombinedMoneyReceiveEachMonthPageContent(): Promise<void> {
    await this.getContinueButton();
    await this.clickMoneyReceivedCheckboxes();
    await expect(this.combinedMoneyReceiveEachMonthHeaderText).toHaveText(
      'You and your partner\u2019s combined monthly income',
    );
    await expect(this.combinedSelectAllOptionsText).toHaveText('Select all options that apply to you.');
    await expect(this.combinedSalaryBeforeTaxLabel).toHaveText('Salary (before tax)');
    await expect(this.combinedTotalSalaryLabel).toHaveText('Total salary amount per month');
    await expect(this.combinedUCText).toContainText('Universal Credit');
    await expect(this.combinedUCAmountHintText).toHaveText(
      'Enter the amount you expect to receive if you haven\u2019t yet had a payment.',
    );
    await expect(this.combinedTotalUCText).toHaveText('Total Universal Credit amount per month');
    await expect(this.combinedCBLabel).toHaveText('Child benefit');
    await expect(this.combinedTotalChildBenefitText).toHaveText('Total child benefit amount per month');
    await expect(this.combinedHBLabel).toHaveText('Housing benefit');
    await expect(this.combinedTotalHousingBenefitText).toHaveText('Total housing benefit amount per month');
    await expect(this.combinedOtherLabel).toHaveText('Other');
    await expect(this.combinedTotalOtherIncomeText).toHaveText('Total other income amount per month');
    await expect(this.combinedOtherIncomeExplanationText).toHaveText('Other Income Explanation');
    await expect(this.combinedPleaseSpecifyText).toHaveText('Please specify below');
    await expect(this.combinedCharactersRemainingText).toHaveText('You have 200 characters remaining');
    await this.clickMoneyReceivedCheckboxes();
  }
  async enterCombinedMoneyReceiveEachMonthDetails(options: string, values: PageInputValues): Promise<void> {
    await this.getContinueButton();
    const optionsList = options.split('-');
    for (const option of optionsList) {
      switch (option) {
        case 'Salary':
          await this.getJavascriptCheckBox('Salary (before tax)').click();
          await this.clearAndEnterTextInElement(this.combinedTotalSalaryInput, values.salaryAmount);
          break;
        case 'Universal Credit':
          await this.getJavascriptCheckBox('Universal Credit').click();
          await this.clearAndEnterTextInElement(this.combinedTotalUCInput, values.amount99);
          break;
        case 'Child Benefit':
          await this.getJavascriptCheckBox('Child benefit').click();
          await this.clearAndEnterTextInElement(this.combinedTotalChildBenefitInput, values.amount99);
          break;
        case 'Housing Benefit':
          await this.getJavascriptCheckBox('Housing benefit').click();
          await this.clearAndEnterTextInElement(this.combinedTotalHousingBenefitInput, values.amount99);
          break;
        case 'Other':
          await this.getJavascriptCheckBox('Other').click();
          await this.clearAndEnterTextInElement(this.combinedTotalOtherIncomeInput, values.amount99);
          await this.clearAndEnterTextInElement(this.combinedPleaseSpecifyInput, values.randomText99);
          break;
        default:
          throw new Error('Invalid option: ' + option);
      }
    }
    await this.clickContinue();
  }
  async enterCombinedMoneyReceivedDetails(
    salaryAmount: string,
    universalCreditAmount: string,
    childBenefitAmount: string,
    housingBenefitAmount: string,
    otherIncomeAmount: string,
    explanationText: string,
  ): Promise<void> {
    await this.getContinueButton();
    await this.clearAndEnterTextInElement(this.combinedTotalSalaryInput, salaryAmount);
    await this.clearAndEnterTextInElement(this.combinedTotalUCInput, universalCreditAmount);
    await this.clearAndEnterTextInElement(this.combinedTotalChildBenefitInput, childBenefitAmount);
    await this.clearAndEnterTextInElement(this.combinedTotalHousingBenefitInput, housingBenefitAmount);
    await this.clearAndEnterTextInElement(this.combinedTotalOtherIncomeInput, otherIncomeAmount);
    await this.clearAndEnterTextInElement(this.combinedPleaseSpecifyInput, explanationText);
    await this.clickContinue();
  }
  async clickMoneyReceivedCheckboxes(): Promise<void> {
    await this.getContinueButton();
    await this.getJavascriptCheckBox('Salary (before tax)').click();
    await this.getJavascriptCheckBox('Universal Credit').click();
    await this.getJavascriptCheckBox('Child benefit').click();
    await this.getJavascriptCheckBox('Housing benefit').click();
    await this.getJavascriptCheckBox('Other').click();
  }
  async validateCombinedMoneyReceiveEachMonthPageErrors(values: PageInputValues): Promise<void> {
    await expect(this.combinedMoneyReceivedBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.combinedMoneyReceiveOptionMainError).toHaveText(
      "Select options for you and your partner's monthly income",
    );
    await expect(this.combinedMoneyReceiveOptionSubError).toContainText(
      "Select options for you and your partner's monthly income",
    );
    await this.clickMoneyReceivedCheckboxes();
    await this.clickContinue();
    await expect(this.combinedSalaryMainError).toHaveText('Enter total salary amount per month');
    await expect(this.combinedSalarySubError).toContainText('Enter total salary amount per month');
    await expect(this.combinedUniversalCreditMainError).toHaveText('Enter total Universal Credit amount per month');
    await expect(this.combinedUniversalCreditSubError).toContainText('Enter total Universal Credit amount per month');
    await expect(this.combinedChildBenefitMainError).toHaveText('Enter total child benefit amount per month');
    await expect(this.combinedChildBenefitSubError).toContainText('Enter total child benefit amount per month');
    await expect(this.combinedHousingBenefitMainError).toHaveText('Enter total housing benefit amount per month');
    await expect(this.combinedHousingBenefitSubError).toContainText('Enter total housing benefit amount per month');
    await expect(this.combinedOtherIncomeMainError).toHaveText('Enter total other income amount per month');
    await expect(this.combinedOtherIncomeSubError).toContainText('Enter total other income amount per month');
    await expect(this.combinedOtherIncomeDetailsMainError).toHaveText('Enter details about your other income');
    await expect(this.combinedOtherIncomeDetailsSubError).toContainText('Enter details about your other income');
    await this.enterCombinedMoneyReceivedDetails(
      values.zeroAmount,
      values.zeroAmount,
      values.zeroAmount,
      values.zeroAmount,
      values.zeroAmount,
      values.randomText260,
    );
    await expect(this.combinedSalaryMainError).toHaveText('Salary amount must be greater than zero');
    await expect(this.combinedSalarySubError).toContainText('Salary amount must be greater than zero');
    await expect(this.combinedUniversalCreditMainError).toHaveText('Universal Credit amount must be greater than zero');
    await expect(this.combinedUniversalCreditSubError).toContainText(
      'Universal Credit amount must be greater than zero',
    );
    await expect(this.combinedChildBenefitMainError).toHaveText('Child benefit amount must be greater than zero');
    await expect(this.combinedChildBenefitSubError).toContainText('Child benefit amount must be greater than zero');
    await expect(this.combinedHousingBenefitMainError).toHaveText('Housing benefit amount must be greater than zero');
    await expect(this.combinedHousingBenefitSubError).toContainText('Housing benefit amount must be greater than zero');
    await expect(this.combinedOtherIncomeMainError).toHaveText('Other income amount must be greater than zero');
    await expect(this.combinedOtherIncomeSubError).toContainText('Other income amount must be greater than zero');
    await expect(this.combinedOtherIncomeDetailsMainError).toHaveText(
      'Other income details must be 200 characters or less',
    );
    await expect(this.combinedOtherIncomeDetailsSubError).toContainText(
      'Other income details must be 200 characters or less',
    );
    await this.enterCombinedMoneyReceivedDetails(
      values.negativeSalaryAmount,
      values.negativeAmount,
      values.negativeAmount,
      values.negativeAmount,
      values.negativeAmount,
      values.randomText10,
    );
    await expect(this.combinedSalaryMainError).toHaveText('Salary amount must be greater than zero');
    await expect(this.combinedSalarySubError).toContainText('Salary amount must be greater than zero');
    await expect(this.combinedUniversalCreditMainError).toHaveText('Universal Credit amount must be greater than zero');
    await expect(this.combinedUniversalCreditSubError).toContainText(
      'Universal Credit amount must be greater than zero',
    );
    await expect(this.combinedChildBenefitMainError).toHaveText('Child benefit amount must be greater than zero');
    await expect(this.combinedChildBenefitSubError).toContainText('Child benefit amount must be greater than zero');
    await expect(this.combinedHousingBenefitMainError).toHaveText('Housing benefit amount must be greater than zero');
    await expect(this.combinedHousingBenefitSubError).toContainText('Housing benefit amount must be greater than zero');
    await expect(this.combinedOtherIncomeMainError).toHaveText('Other income amount must be greater than zero');
    await expect(this.combinedOtherIncomeSubError).toContainText('Other income amount must be greater than zero');
    await this.enterCombinedMoneyReceivedDetails(
      values.salaryWithLetter,
      values.amountWithLetter,
      values.amountWithLetter,
      values.amountWithLetter,
      values.amountWithLetter,
      values.randomText100,
    );
    await expect(this.combinedSalaryMainError).toHaveText('Salary amount must be greater than zero');
    await expect(this.combinedSalarySubError).toContainText('Salary amount must be greater than zero');
    await expect(this.combinedUniversalCreditMainError).toHaveText(
      'Universal Credit must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedUniversalCreditSubError).toContainText(
      'Universal Credit must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedChildBenefitMainError).toHaveText(
      'Child benefit must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedChildBenefitSubError).toContainText(
      'Child benefit must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedHousingBenefitMainError).toHaveText(
      'Housing benefit must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedHousingBenefitSubError).toContainText(
      'Housing benefit must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedOtherIncomeMainError).toHaveText(
      'Other income must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedOtherIncomeSubError).toContainText(
      'Other income must be in pounds and pence; for example £100.00',
    );
    await this.enterCombinedMoneyReceivedDetails(
      values.salaryWithThreeDecimals,
      values.utilityBillsWithThreeDecimals,
      values.foodWithThreeDecimals,
      values.threeDecimalAmount,
      values.threeDecimalAmount,
      values.randomText100,
    );
    await expect(this.combinedSalaryMainError).toHaveText(
      'Salary must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedSalarySubError).toContainText(
      'Salary must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedUniversalCreditMainError).toHaveText(
      'Universal Credit must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedUniversalCreditSubError).toContainText(
      'Universal Credit must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedChildBenefitMainError).toHaveText(
      'Child benefit must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedChildBenefitSubError).toContainText(
      'Child benefit must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedHousingBenefitMainError).toHaveText(
      'Housing benefit must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedHousingBenefitSubError).toContainText(
      'Housing benefit must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedOtherIncomeMainError).toHaveText(
      'Other income must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedOtherIncomeSubError).toContainText(
      'Other income must be in pounds and pence; for example £100.00',
    );
    await this.clickMoneyReceivedCheckboxes();
  }
}
