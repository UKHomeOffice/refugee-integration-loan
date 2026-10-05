import { Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
import { PageInputValues } from '../test-data/page-input-values';
export class RilMoneyDoYouSpentEachMonthPage extends basePage {
  readonly moneyDoYouSpentEachMonthHeaderText: Locator;
  readonly selectAllOptionsText: Locator;
  readonly rentLabel: Locator;
  readonly totalRentText: Locator;
  readonly totalRentInput: Locator;
  readonly utilitiesBillsLabel: Locator;
  readonly totalUtilitiesBillsText: Locator;
  readonly totalUtilitiesBillsInput: Locator;
  readonly foodCleaningLabel: Locator;
  readonly totalFoodCleaningText: Locator;
  readonly totalFoodBillsInput: Locator;
  readonly mobilePhoneLabel: Locator;
  readonly totalMobilePhoneText: Locator;
  readonly totalMobilePhoneInput: Locator;
  readonly travelLabel: Locator;
  readonly totalTravelText: Locator;
  readonly totalTravelInput: Locator;
  readonly clothingFootwearLabel: Locator;
  readonly totalClothingFootwearText: Locator;
  readonly totalClothingFootwearInput: Locator;
  readonly ucDeductionsLabel: Locator;
  readonly totalUCDeductionsText: Locator;
  readonly totalUCDeductionsInput: Locator;
  readonly otherLabel: Locator;
  readonly includePaymentsHint: Locator;
  readonly totalOutgoingsText: Locator;
  readonly totalOutgoingInput: Locator;
  readonly moneySpentBackNavBtn: Locator;
  readonly moneyDoYouReceiveEachMonthMainError: Locator;
  readonly moneyDoYouReceiveEachMonthSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.moneyDoYouSpentEachMonthHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.selectAllOptionsText = page.locator('div#outgoingTypes-hint').first();
    this.rentLabel = page.locator("label[for='outgoingTypes-rent']").first();
    this.totalRentText = page.locator("label[for='rentAmount']").first();
    this.totalRentInput = page.locator('input#rentAmount').first();
    this.utilitiesBillsLabel = page.locator("label[for='outgoingTypes-household_bills']").first();
    this.totalUtilitiesBillsText = page.locator("label[for='householdBillsAmount']").first();
    this.totalUtilitiesBillsInput = page.locator('input#householdBillsAmount').first();
    this.foodCleaningLabel = page.locator("label[for='outgoingTypes-food_toiletries_cleaning_supplies']").first();
    this.totalFoodCleaningText = page.locator("label[for='foodToiletriesAndCleaningSuppliesAmount']").first();
    this.totalFoodBillsInput = page.locator('input#foodToiletriesAndCleaningSuppliesAmount').first();
    this.mobilePhoneLabel = page.locator("label[for='outgoingTypes-mobile_phone']").first();
    this.totalMobilePhoneText = page.locator("label[for='mobilePhoneAmount']").first();
    this.totalMobilePhoneInput = page.locator('input#mobilePhoneAmount').first();
    this.travelLabel = page.locator("label[for='outgoingTypes-travel']").first();
    this.totalTravelText = page.locator("label[for='travelAmount']").first();
    this.totalTravelInput = page.locator('input#travelAmount').first();
    this.clothingFootwearLabel = page.locator("label[for='outgoingTypes-clothing_and_footwear']").first();
    this.totalClothingFootwearText = page.locator("label[for='clothingAndFootwearAmount']").first();
    this.totalClothingFootwearInput = page.locator('input#clothingAndFootwearAmount').first();
    this.ucDeductionsLabel = page.locator("label[for='outgoingTypes-universal_credit_deductions']").first();
    this.totalUCDeductionsText = page.locator("label[for='universalCreditDeductionsAmount']").first();
    this.totalUCDeductionsInput = page.locator('input#universalCreditDeductionsAmount').first();
    this.otherLabel = page.locator("label[for='outgoingTypes-other']").first();
    this.includePaymentsHint = page.locator('div#outgoingTypes-other-item-hint').first();
    this.totalOutgoingsText = page.locator("label[for='otherOutgoingAmount']").first();
    this.totalOutgoingInput = page.locator('input#otherOutgoingAmount').first();
    this.moneySpentBackNavBtn = page.locator("a[href='/apply/income']").first();
    this.moneyDoYouReceiveEachMonthMainError = page.locator("a[href='#niNumber']").first();
    this.moneyDoYouReceiveEachMonthSubError = page.locator('div#niNumber-group>p').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'How much money do you spend each month? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async enterMoneyDoYouSpentEachMonthDetails(options: string, values: PageInputValues): Promise<void> {
    await this.getContinueButton();
    const optionsList = options.split('-');
    for (const option of optionsList) {
      switch (option) {
        case 'Rent':
          await this.getJavascriptCheckBox('Rent').click();
          await this.clearAndEnterTextInElement(this.totalRentInput, values.rentAmount);
          break;
        case 'Utility bills':
          await this.getJavascriptCheckBox('Utility (household) bills').click();
          await this.clearAndEnterTextInElement(this.totalUtilitiesBillsInput, values.utilityBillsAmount);
          break;
        case 'Food cleaning':
          await this.getJavascriptCheckBox('Food, toiletries and cleaning supplies').click();
          await this.clearAndEnterTextInElement(this.totalFoodBillsInput, values.foodAmount);
          break;
        case 'Mobile phone':
          await this.getJavascriptCheckBox('Mobile phone').click();
          await this.clearAndEnterTextInElement(this.totalMobilePhoneInput, values.mobilePhoneAmount);
          break;
        case 'Travel':
          await this.getJavascriptCheckBox('Travel').click();
          await this.clearAndEnterTextInElement(this.totalTravelInput, values.travelAmount);
          break;
        case 'Clothing':
          await this.getJavascriptCheckBox('Clothing and footwear').click();
          await this.clearAndEnterTextInElement(this.totalClothingFootwearInput, values.clothingAmount);
          break;
        case 'Universal credit deductions':
          await this.getJavascriptCheckBox('Universal Credit deductions').click();
          await this.clearAndEnterTextInElement(this.totalUCDeductionsInput, values.universalCreditDeductionsAmount);
          break;
        case 'Other':
          await this.getJavascriptCheckBox('Other').click();
          await this.clearAndEnterTextInElement(this.totalOutgoingInput, values.otherOutgoingAmount);
          break;
        default:
          throw new Error('Invalid option: ' + option);
      }
    }
  }
  async completeMoneyDoYouSpentEachMonthPage(options: string, values: PageInputValues): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.enterMoneyDoYouSpentEachMonthDetails(options, values);
    await this.clickContinueButton();
  }
}
