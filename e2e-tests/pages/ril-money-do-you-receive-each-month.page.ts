import { Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
import { PageInputValues } from '../test-data/page-input-values';
export class RilMoneyDoYouReceiveEachMonthPage extends basePage {
  readonly moneyDoYouReceiveEachMonthHeaderText: Locator;
  readonly selectAllOptionsText: Locator;
  readonly salaryBeforeTaxLabel: Locator;
  readonly totalSalaryText: Locator;
  readonly totalSalaryInput: Locator;
  readonly ucLabel: Locator;
  readonly ucAmountText: Locator;
  readonly totalUCText: Locator;
  readonly totalUCInput: Locator;
  readonly cbLabel: Locator;
  readonly totalChildBenefitText: Locator;
  readonly totalChildBenefitInput: Locator;
  readonly hbLabel: Locator;
  readonly totalHousingBenefitText: Locator;
  readonly totalHousingBenefitInput: Locator;
  readonly otherLabel: Locator;
  readonly totalOtherIncomeText: Locator;
  readonly totalOtherIncomeInput: Locator;
  readonly otherIncomeExplanationText: Locator;
  readonly pleaseSpecifyText: Locator;
  readonly pleaseSpecifyInput: Locator;
  readonly charactersRemainingText: Locator;
  readonly moneyReceivedBackNavBtn: Locator;
  readonly moneyDoYouReceiveEachMonthMainError: Locator;
  readonly moneyDoYouReceiveEachMonthSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.moneyDoYouReceiveEachMonthHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.selectAllOptionsText = page.locator('div#incomeTypes-hint').first();
    this.salaryBeforeTaxLabel = page.locator("label[for='incomeTypes-salary']").first();
    this.totalSalaryText = page.locator('div#salaryAmount-panel>div>div>label').first();
    this.totalSalaryInput = page.locator('input#salaryAmount').first();
    this.ucLabel = page.locator("label[for='combinedIncomeTypes-universal_credit']").first();
    this.ucAmountText = page.locator('div#incomeTypes-universal_credit-item-hint').first();
    this.totalUCText = page.locator("label[for='universalCreditAmount']").first();
    this.totalUCInput = page.locator('input#universalCreditAmount').first();
    this.cbLabel = page.locator("label[for='incomeTypes-child_benefit']").first();
    this.totalChildBenefitText = page.locator("label[for='childBenefitAmount']").first();
    this.totalChildBenefitInput = page.locator('input#childBenefitAmount').first();
    this.hbLabel = page.locator("label[for='incomeTypes-housing_benefit']").first();
    this.totalHousingBenefitText = page.locator("label[for='housingBenefitAmount']").first();
    this.totalHousingBenefitInput = page.locator('input#housingBenefitAmount').first();
    this.otherLabel = page.locator("label[for='incomeTypes-other']").first();
    this.totalOtherIncomeText = page.locator("label[for='otherIncomeAmount']").first();
    this.totalOtherIncomeInput = page.locator('input#otherIncomeAmount').first();
    this.otherIncomeExplanationText = page.locator("label[for='otherIncomeExplain']").first();
    this.pleaseSpecifyText = page.locator('div#otherIncomeExplain-hint').first();
    this.pleaseSpecifyInput = page.locator('textarea#otherIncomeExplain').first();
    this.charactersRemainingText = page.locator('div#otherIncomeExplain-info').first();
    this.moneyReceivedBackNavBtn = page.locator("a[href='/apply/ni-number']").first();
    this.moneyDoYouReceiveEachMonthMainError = page.locator("a[href='#niNumber']").first();
    this.moneyDoYouReceiveEachMonthSubError = page.locator('div#niNumber-group>p').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'How much money do you receive each month? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async enterMoneyDoYouReceiveEachMonthDetails(options: string, values: PageInputValues): Promise<void> {
    await this.getContinueButton();
    const optionsList = options.split('-');
    for (const option of optionsList) {
      switch (option) {
        case 'Salary':
          await this.getJavascriptCheckBox('Salary (before tax)').click();
          await this.clearAndEnterTextInElement(this.totalSalaryInput, values.salaryAmount);
          break;
        case 'Universal Credit':
          await this.getJavascriptCheckBox('Universal Credit').click();
          await this.clearAndEnterTextInElement(this.totalUCInput, values.amount99);
          break;
        case 'Child Benefit':
          await this.getJavascriptCheckBox('Child benefit').click();
          await this.clearAndEnterTextInElement(this.totalChildBenefitInput, values.amount99);
          break;
        case 'Housing Benefit':
          await this.getJavascriptCheckBox('Housing benefit').click();
          await this.clearAndEnterTextInElement(this.totalHousingBenefitInput, values.amount99);
          break;
        case 'Other':
          await this.getJavascriptCheckBox('Other').click();
          await this.clearAndEnterTextInElement(this.totalOtherIncomeInput, values.amount99);
          await this.clearAndEnterTextInElement(this.pleaseSpecifyInput, values.randomText99);
          break;
        default:
          throw new Error('Invalid option: ' + option);
      }
    }
  }
  async completeMoneyDoYouReceiveEachMonthPage(options: string, values: PageInputValues): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.enterMoneyDoYouReceiveEachMonthDetails(options, values);
    await this.clickContinueButton();
  }
}
