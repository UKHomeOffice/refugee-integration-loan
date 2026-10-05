import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
import { ConstantsLib } from '../utility-helper/constants-lib';
export class RilCombinedMoneySpentEachMonthPage extends basePage {
  readonly combinedMoneySpentEachMonthHeaderText: Locator;
  readonly combinedSelectAllOptionsText: Locator;
  readonly combinedRentLabel: Locator;
  readonly combinedTotalRentText: Locator;
  readonly combinedTotalRentInput: Locator;
  readonly combinedUtilitiesBillsLabel: Locator;
  readonly combinedTotalUtilitiesBillsText: Locator;
  readonly combinedTotalUtilitiesBillsInput: Locator;
  readonly combinedFoodCleaningLabel: Locator;
  readonly combinedTotalFoodCleaningText: Locator;
  readonly combinedTotalFoodBillsInput: Locator;
  readonly combinedMobilePhoneLabel: Locator;
  readonly combinedTotalMobilePhoneText: Locator;
  readonly combinedTotalMobilePhoneInput: Locator;
  readonly combinedTravelLabel: Locator;
  readonly combinedTotalTravelText: Locator;
  readonly combinedTotalTravelInput: Locator;
  readonly combinedClothingFootwearLabel: Locator;
  readonly combinedTotalClothingFootwearText: Locator;
  readonly combinedTotalClothingFootwearInput: Locator;
  readonly combinedUCDeductionsLabel: Locator;
  readonly combinedTotalUCDeductionsText: Locator;
  readonly combinedTotalUCDeductionsInput: Locator;
  readonly combinedOtherLabel: Locator;
  readonly combinedIncludePaymentsHint: Locator;
  readonly combinedTotalOutgoingsText: Locator;
  readonly combinedTotalOutgoingInput: Locator;
  readonly combinedMoneySpentBackNavBtn: Locator;
  readonly combinedMoneyReceiveEachMonthMainError: Locator;
  readonly combinedMoneyReceiveEachMonthSubError: Locator;
  readonly combinedRentAmountMainError: Locator;
  readonly combinedRentAmountSubError: Locator;
  readonly combinedHouseholdBillsAmountMainError: Locator;
  readonly combinedHouseholdBillsAmountSubError: Locator;
  readonly combinedFoodAndToiletriesAmountMainError: Locator;
  readonly combinedFoodAndToiletriesAmountSubError: Locator;
  readonly combinedMobilePhoneAmountMainError: Locator;
  readonly combinedMobilePhoneAmountSubError: Locator;
  readonly combinedTravelAmountMainError: Locator;
  readonly combinedTravelAmountSubError: Locator;
  readonly combinedClothingAndFootwearAmountMainError: Locator;
  readonly combinedClothingAndFootwearAmountSubError: Locator;
  readonly combinedUniversalCreditDeductionsAmountMainError: Locator;
  readonly combinedUniversalCreditDeductionsAmountSubError: Locator;
  readonly combinedTotalOutgoingsMainError: Locator;
  readonly combinedTotalOutgoingsSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.combinedMoneySpentEachMonthHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.combinedSelectAllOptionsText = page.locator('div#combinedOutgoingTypes-hint').first();
    this.combinedRentLabel = page.locator("label[for='combinedOutgoingTypes-rent']").first();
    this.combinedTotalRentText = page.locator("label[for='combinedRentAmount']").first();
    this.combinedTotalRentInput = page.locator('input#combinedRentAmount').first();
    this.combinedUtilitiesBillsLabel = page.locator("label[for='combinedOutgoingTypes-household_bills']").first();
    this.combinedTotalUtilitiesBillsText = page.locator("label[for='combinedHouseholdBillsAmount']").first();
    this.combinedTotalUtilitiesBillsInput = page.locator('input#combinedHouseholdBillsAmount').first();
    this.combinedFoodCleaningLabel = page
      .locator("label[for='combinedOutgoingTypes-food_toiletries_cleaning_supplies']")
      .first();
    this.combinedTotalFoodCleaningText = page
      .locator("label[for='combinedFoodToiletriesAndCleaningSuppliesAmount']")
      .first();
    this.combinedTotalFoodBillsInput = page.locator('input#combinedFoodToiletriesAndCleaningSuppliesAmount').first();
    this.combinedMobilePhoneLabel = page.locator("label[for='combinedOutgoingTypes-mobile_phone']").first();
    this.combinedTotalMobilePhoneText = page.locator("label[for='combinedMobilePhoneAmount']").first();
    this.combinedTotalMobilePhoneInput = page.locator('input#combinedMobilePhoneAmount').first();
    this.combinedTravelLabel = page.locator("label[for='combinedOutgoingTypes-travel']").first();
    this.combinedTotalTravelText = page.locator("label[for='combinedTravelAmount']").first();
    this.combinedTotalTravelInput = page.locator('input#combinedTravelAmount').first();
    this.combinedClothingFootwearLabel = page
      .locator("label[for='combinedOutgoingTypes-clothing_and_footwear']")
      .first();
    this.combinedTotalClothingFootwearText = page.locator("label[for='combinedClothingAndFootwearAmount']").first();
    this.combinedTotalClothingFootwearInput = page.locator('input#combinedClothingAndFootwearAmount').first();
    this.combinedUCDeductionsLabel = page
      .locator("label[for='combinedOutgoingTypes-universal_credit_deductions']")
      .first();
    this.combinedTotalUCDeductionsText = page.locator("label[for='combinedUniversalCreditDeductionsAmount']").first();
    this.combinedTotalUCDeductionsInput = page.locator('input#combinedUniversalCreditDeductionsAmount').first();
    this.combinedOtherLabel = page.locator("label[for='combinedOutgoingTypes-other']").first();
    this.combinedIncludePaymentsHint = page.locator('div#combinedOutgoingTypes-other-item-hint').first();
    this.combinedTotalOutgoingsText = page.locator("label[for='combinedOtherOutgoingAmount']").first();
    this.combinedTotalOutgoingInput = page.locator('input#combinedOtherOutgoingAmount').first();
    this.combinedMoneySpentBackNavBtn = page.locator("a[href='/apply/combined-income']").first();
    this.combinedMoneyReceiveEachMonthMainError = page.locator("a[href='#combinedOutgoingTypes-rent']").first();
    this.combinedMoneyReceiveEachMonthSubError = page.locator('p#combinedOutgoingTypes-error').first();
    this.combinedRentAmountMainError = page.locator("a[href='#combinedRentAmount']").first();
    this.combinedRentAmountSubError = page.locator('div#combinedRentAmount-group>p').first();
    this.combinedHouseholdBillsAmountMainError = page.locator("a[href='#combinedHouseholdBillsAmount']").first();
    this.combinedHouseholdBillsAmountSubError = page.locator('div#combinedHouseholdBillsAmount-group>p').first();
    this.combinedFoodAndToiletriesAmountMainError = page
      .locator("a[href='#combinedFoodToiletriesAndCleaningSuppliesAmount']")
      .first();
    this.combinedFoodAndToiletriesAmountSubError = page
      .locator('div#combinedFoodToiletriesAndCleaningSuppliesAmount-group>p')
      .first();
    this.combinedMobilePhoneAmountMainError = page.locator("a[href='#combinedMobilePhoneAmount']").first();
    this.combinedMobilePhoneAmountSubError = page.locator('div#combinedMobilePhoneAmount-group>p').first();
    this.combinedTravelAmountMainError = page.locator("a[href='#combinedTravelAmount']").first();
    this.combinedTravelAmountSubError = page.locator('div#combinedTravelAmount-group>p').first();
    this.combinedClothingAndFootwearAmountMainError = page
      .locator("a[href='#combinedClothingAndFootwearAmount']")
      .first();
    this.combinedClothingAndFootwearAmountSubError = page
      .locator('div#combinedClothingAndFootwearAmount-group>p')
      .first();
    this.combinedUniversalCreditDeductionsAmountMainError = page
      .locator("a[href='#combinedUniversalCreditDeductionsAmount']")
      .first();
    this.combinedUniversalCreditDeductionsAmountSubError = page
      .locator('div#combinedUniversalCreditDeductionsAmount-group>p')
      .first();
    this.combinedTotalOutgoingsMainError = page.locator("a[href='#combinedOtherOutgoingAmount']").first();
    this.combinedTotalOutgoingsSubError = page.locator('div#combinedOtherOutgoingAmount-group>p').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'You and your partner\u2019s combined monthly outgoings – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateCombinedMoneySpentEachMonthPageContent(): Promise<void> {
    await expect(this.combinedMoneySpentBackNavBtn).toBeVisible();
    await this.clickMoneySpentCheckboxes();
    await expect(this.combinedMoneySpentEachMonthHeaderText).toHaveText(
      'You and your partner\u2019s combined monthly outgoings',
    );
    await expect(this.combinedSelectAllOptionsText).toHaveText('Select all options that currently apply to you.');
    await expect(this.combinedRentLabel).toHaveText('Rent');
    await expect(this.combinedTotalRentText).toHaveText('Total rent amount per month');
    await expect(this.combinedUtilitiesBillsLabel).toHaveText('Utility (household) bills');
    await expect(this.combinedTotalUtilitiesBillsText).toHaveText('Total utility bills amount per month');
    await expect(this.combinedFoodCleaningLabel).toHaveText('Food, toiletries and cleaning supplies');
    await expect(this.combinedTotalFoodCleaningText).toHaveText(
      'Total food, toiletries and cleaning supplies amount per month',
    );
    await expect(this.combinedMobilePhoneLabel).toHaveText('Mobile phone');
    await expect(this.combinedTotalMobilePhoneText).toHaveText('Total mobile phone amount per month');
    await expect(this.combinedTravelLabel).toHaveText('Travel');
    await expect(this.combinedTotalTravelText).toHaveText('Total travel amount per month');
    await expect(this.combinedClothingFootwearLabel).toHaveText('Clothing and footwear');
    await expect(this.combinedTotalClothingFootwearText).toHaveText('Total clothing and footwear amount per month');
    await expect(this.combinedUCDeductionsLabel).toHaveText('Universal Credit deductions');
    await expect(this.combinedTotalUCDeductionsText).toHaveText('Total Universal Credit deductions per month');
    await expect(this.combinedOtherLabel).toContainText('Other');
    await expect(this.combinedIncludePaymentsHint).toHaveText('This includes payments for credit card debt and loans.');
    await expect(this.combinedTotalOutgoingsText).toHaveText('Total other outgoings per month');
    await this.clickMoneySpentCheckboxes();
  }
  async enterCombinedMoneySpentEachMonthDetails(options: string): Promise<void> {
    await this.getContinueButton();
    const optionsList = options.split('-');
    for (const option of optionsList) {
      switch (option) {
        case 'Rent':
          await this.getJavascriptCheckBox('Rent').click();
          await this.clearAndEnterTextInElement(this.combinedTotalRentInput, ConstantsLib.RENT_AMOUNT);
          break;
        case 'Utility bills':
          await this.getJavascriptCheckBox('Utility (household) bills').click();
          await this.clearAndEnterTextInElement(this.combinedTotalUtilitiesBillsInput, ConstantsLib.UTILITY_BILLS_AMOUNT);
          break;
        case 'Food cleaning':
          await this.getJavascriptCheckBox('Food, toiletries and cleaning supplies').click();
          await this.clearAndEnterTextInElement(this.combinedTotalFoodBillsInput, ConstantsLib.FOOD_AMOUNT);
          break;
        case 'Mobile phone':
          await this.getJavascriptCheckBox('Mobile phone').click();
          await this.clearAndEnterTextInElement(this.combinedTotalMobilePhoneInput, ConstantsLib.MOBILE_PHONE_AMOUNT);
          break;
        case 'Travel':
          await this.getJavascriptCheckBox('Travel').click();
          await this.clearAndEnterTextInElement(this.combinedTotalTravelInput, ConstantsLib.TRAVEL_AMOUNT);
          break;
        case 'Clothing':
          await this.getJavascriptCheckBox('Clothing and footwear').click();
          await this.clearAndEnterTextInElement(this.combinedTotalClothingFootwearInput, ConstantsLib.CLOTHING_AMOUNT);
          break;
        case 'Universal credit deductions':
          await this.getJavascriptCheckBox('Universal Credit deductions').click();
          await this.clearAndEnterTextInElement(
            this.combinedTotalUCDeductionsInput,
            ConstantsLib.UNIVERSAL_CREDIT_DEDUCTIONS_AMOUNT,
          );
          break;
        case 'Other':
          await this.getJavascriptCheckBox('Other').click();
          await this.clearAndEnterTextInElement(this.combinedTotalOutgoingInput, ConstantsLib.OTHER_OUTGOING_AMOUNT);
          break;
        default:
          throw new Error('Invalid option: ' + option);
      }
    }
    await this.clickContinue();
  }
  async clickMoneySpentCheckboxes(): Promise<void> {
    await this.getContinueButton();
    await this.getJavascriptCheckBox('Rent').click();
    await this.getJavascriptCheckBox('Utility (household) bills').click();
    await this.getJavascriptCheckBox('Food, toiletries and cleaning supplies').click();
    await this.getJavascriptCheckBox('Mobile phone').click();
    await this.getJavascriptCheckBox('Travel').click();
    await this.getJavascriptCheckBox('Clothing and footwear').click();
    await this.getJavascriptCheckBox('Universal Credit deductions').click();
    await this.getJavascriptCheckBox('Other').click();
  }
  async enterCombinedMoneySpentDetails(
    rent: string,
    utilityBillsAmount: string,
    food: string,
    mobilePhoneAmount: string,
    travel: string,
    clothing: string,
    universalCreditAmount: string,
    total: string,
  ): Promise<void> {
    await this.getContinueButton();
    await this.clearAndEnterTextInElement(this.combinedTotalRentInput, rent);
    await this.clearAndEnterTextInElement(this.combinedTotalUtilitiesBillsInput, utilityBillsAmount);
    await this.clearAndEnterTextInElement(this.combinedTotalFoodBillsInput, food);
    await this.clearAndEnterTextInElement(this.combinedTotalMobilePhoneInput, mobilePhoneAmount);
    await this.clearAndEnterTextInElement(this.combinedTotalTravelInput, travel);
    await this.clearAndEnterTextInElement(this.combinedTotalClothingFootwearInput, clothing);
    await this.clearAndEnterTextInElement(this.combinedTotalUCDeductionsInput, universalCreditAmount);
    await this.clearAndEnterTextInElement(this.combinedTotalOutgoingInput, total);
    await this.clickContinue();
  }
  async validateCombinedMoneySpentEachMonthPageErrors(): Promise<void> {
    await expect(this.combinedMoneySpentBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.combinedMoneyReceiveEachMonthMainError).toHaveText(
      "Select options for you and your partner's monthly outgoings",
    );
    await expect(this.combinedMoneyReceiveEachMonthSubError).toContainText(
      "Select options for you and your partner's monthly outgoings",
    );
    await this.clickMoneySpentCheckboxes();
    await this.clickContinue();
    await expect(this.combinedRentAmountMainError).toHaveText('Enter total rent amount per month');
    await expect(this.combinedRentAmountSubError).toContainText('Enter total rent amount per month');
    await expect(this.combinedHouseholdBillsAmountMainError).toHaveText('Enter total utility bills amount per month');
    await expect(this.combinedHouseholdBillsAmountSubError).toContainText('Enter total utility bills amount per month');
    await expect(this.combinedFoodAndToiletriesAmountMainError).toHaveText(
      'Enter total food, toiletries and cleaning supplies amount per month',
    );
    await expect(this.combinedFoodAndToiletriesAmountSubError).toContainText(
      'Enter total food, toiletries and cleaning supplies amount per month',
    );
    await expect(this.combinedMobilePhoneAmountMainError).toHaveText('Enter total mobile phone amount per month');
    await expect(this.combinedMobilePhoneAmountSubError).toContainText('Enter total mobile phone amount per month');
    await expect(this.combinedTravelAmountMainError).toHaveText('Enter total travel amount per month');
    await expect(this.combinedTravelAmountSubError).toContainText('Enter total travel amount per month');
    await expect(this.combinedClothingAndFootwearAmountMainError).toHaveText(
      'Enter total clothing and footwear amount per month',
    );
    await expect(this.combinedClothingAndFootwearAmountSubError).toContainText(
      'Enter total clothing and footwear amount per month',
    );
    await expect(this.combinedUniversalCreditDeductionsAmountMainError).toHaveText(
      'Enter total Universal Credit deductions amount per month',
    );
    await expect(this.combinedUniversalCreditDeductionsAmountSubError).toContainText(
      'Enter total Universal Credit deductions amount per month',
    );
    await expect(this.combinedTotalOutgoingsMainError).toHaveText('Enter total other outgoings per month');
    await expect(this.combinedTotalOutgoingsSubError).toContainText('Enter total other outgoings per month');
    await this.enterCombinedMoneySpentDetails(
      ConstantsLib.ZERO_AMOUNT,
      ConstantsLib.ZERO_AMOUNT,
      ConstantsLib.ZERO_AMOUNT,
      ConstantsLib.ZERO_AMOUNT,
      ConstantsLib.ZERO_AMOUNT,
      ConstantsLib.ZERO_AMOUNT,
      ConstantsLib.ZERO_AMOUNT,
      ConstantsLib.ZERO_AMOUNT,
    );
    await expect(this.combinedRentAmountMainError).toHaveText('Rent amount must be greater than zero');
    await expect(this.combinedRentAmountSubError).toContainText('Rent amount must be greater than zero');
    await expect(this.combinedHouseholdBillsAmountMainError).toHaveText(
      'Household bills amount must be greater than zero',
    );
    await expect(this.combinedHouseholdBillsAmountSubError).toContainText(
      'Household bills amount must be greater than zero',
    );
    await expect(this.combinedFoodAndToiletriesAmountMainError).toHaveText(
      'Food, toiletries and cleaning supplies amount must be greater than zero',
    );
    await expect(this.combinedFoodAndToiletriesAmountSubError).toContainText(
      'Food, toiletries and cleaning supplies amount must be greater than zero',
    );
    await expect(this.combinedMobilePhoneAmountMainError).toHaveText('Mobile phone amount must be greater than zero');
    await expect(this.combinedMobilePhoneAmountSubError).toContainText('Mobile phone amount must be greater than zero');
    await expect(this.combinedTravelAmountMainError).toHaveText('Travel amount must be greater than zero');
    await expect(this.combinedTravelAmountSubError).toContainText('Travel amount must be greater than zero');
    await expect(this.combinedClothingAndFootwearAmountMainError).toHaveText(
      'Clothing and footwear amount must be greater than zero',
    );
    await expect(this.combinedClothingAndFootwearAmountSubError).toContainText(
      'Clothing and footwear amount must be greater than zero',
    );
    await expect(this.combinedUniversalCreditDeductionsAmountMainError).toHaveText(
      'Universal Credit deductions must be greater than zero',
    );
    await expect(this.combinedUniversalCreditDeductionsAmountSubError).toContainText(
      'Universal Credit deductions must be greater than zero',
    );
    await expect(this.combinedTotalOutgoingsMainError).toHaveText('Other outgoings amount must be greater than zero');
    await expect(this.combinedTotalOutgoingsSubError).toContainText('Other outgoings amount must be greater than zero');
    await this.enterCombinedMoneySpentDetails(
      ConstantsLib.NEGATIVE_SALARY_AMOUNT,
      ConstantsLib.NEGATIVE_AMOUNT,
      ConstantsLib.NEGATIVE_AMOUNT,
      ConstantsLib.NEGATIVE_AMOUNT,
      ConstantsLib.NEGATIVE_AMOUNT,
      ConstantsLib.NEGATIVE_AMOUNT,
      ConstantsLib.NEGATIVE_AMOUNT,
      ConstantsLib.NEGATIVE_AMOUNT,
    );
    await expect(this.combinedRentAmountMainError).toHaveText('Rent amount must be greater than zero');
    await expect(this.combinedRentAmountSubError).toContainText('Rent amount must be greater than zero');
    await expect(this.combinedHouseholdBillsAmountMainError).toHaveText(
      'Household bills amount must be greater than zero',
    );
    await expect(this.combinedHouseholdBillsAmountSubError).toContainText(
      'Household bills amount must be greater than zero',
    );
    await expect(this.combinedFoodAndToiletriesAmountMainError).toHaveText(
      'Food, toiletries and cleaning supplies amount must be greater than zero',
    );
    await expect(this.combinedFoodAndToiletriesAmountSubError).toContainText(
      'Food, toiletries and cleaning supplies amount must be greater than zero',
    );
    await expect(this.combinedMobilePhoneAmountMainError).toHaveText('Mobile phone amount must be greater than zero');
    await expect(this.combinedMobilePhoneAmountSubError).toContainText('Mobile phone amount must be greater than zero');
    await expect(this.combinedTravelAmountMainError).toHaveText('Travel amount must be greater than zero');
    await expect(this.combinedTravelAmountSubError).toContainText('Travel amount must be greater than zero');
    await expect(this.combinedClothingAndFootwearAmountMainError).toHaveText(
      'Clothing and footwear amount must be greater than zero',
    );
    await expect(this.combinedClothingAndFootwearAmountSubError).toContainText(
      'Clothing and footwear amount must be greater than zero',
    );
    await expect(this.combinedUniversalCreditDeductionsAmountMainError).toHaveText(
      'Universal Credit deductions must be greater than zero',
    );
    await expect(this.combinedUniversalCreditDeductionsAmountSubError).toContainText(
      'Universal Credit deductions must be greater than zero',
    );
    await expect(this.combinedTotalOutgoingsMainError).toHaveText('Other outgoings amount must be greater than zero');
    await expect(this.combinedTotalOutgoingsSubError).toContainText('Other outgoings amount must be greater than zero');
    await this.enterCombinedMoneySpentDetails(
      ConstantsLib.SALARY_WITH_LETTER,
      ConstantsLib.AMOUNT_WITH_LETTER,
      ConstantsLib.AMOUNT_WITH_LETTER,
      ConstantsLib.AMOUNT_WITH_LETTER,
      ConstantsLib.AMOUNT_WITH_LETTER,
      ConstantsLib.AMOUNT_WITH_LETTER,
      ConstantsLib.AMOUNT_WITH_LETTER,
      ConstantsLib.AMOUNT_WITH_LETTER,
    );
    await expect(this.combinedRentAmountMainError).toHaveText(
      'Rent must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedRentAmountSubError).toContainText(
      'Rent must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedHouseholdBillsAmountMainError).toHaveText(
      'Household bills amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedHouseholdBillsAmountSubError).toContainText(
      'Household bills amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedFoodAndToiletriesAmountMainError).toHaveText(
      'Food, toiletries and cleaning supplies amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedFoodAndToiletriesAmountSubError).toContainText(
      'Food, toiletries and cleaning supplies amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedMobilePhoneAmountMainError).toHaveText(
      'Mobile phone amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedMobilePhoneAmountSubError).toContainText(
      'Mobile phone amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedTravelAmountMainError).toHaveText(
      'Travel amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedTravelAmountSubError).toContainText(
      'Travel amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedClothingAndFootwearAmountMainError).toHaveText(
      'Clothing and footwear amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedClothingAndFootwearAmountSubError).toContainText(
      'Clothing and footwear amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedUniversalCreditDeductionsAmountMainError).toHaveText(
      'Universal Credit deductions must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedUniversalCreditDeductionsAmountSubError).toContainText(
      'Universal Credit deductions must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedTotalOutgoingsMainError).toHaveText(
      'Other outgoings amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedTotalOutgoingsSubError).toContainText(
      'Other outgoings amount must be in pounds and pence; for example £100.00',
    );
    await this.enterCombinedMoneySpentDetails(
      ConstantsLib.RENT_WITH_THREE_DECIMALS,
      ConstantsLib.UTILITY_BILLS_WITH_THREE_DECIMALS,
      ConstantsLib.FOOD_WITH_THREE_DECIMALS,
      ConstantsLib.PHONE_WITH_THREE_DECIMALS,
      ConstantsLib.TRAVEL_WITH_THREE_DECIMALS,
      ConstantsLib.CLOTHING_WITH_THREE_DECIMALS,
      ConstantsLib.DEDUCTIONS_WITH_THREE_DECIMALS,
      ConstantsLib.OTHER_OUTGOINGS_WITH_THREE_DECIMALS,
    );
    await expect(this.combinedRentAmountMainError).toHaveText(
      'Rent must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedRentAmountSubError).toContainText(
      'Rent must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedHouseholdBillsAmountMainError).toHaveText(
      'Household bills amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedHouseholdBillsAmountSubError).toContainText(
      'Household bills amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedFoodAndToiletriesAmountMainError).toHaveText(
      'Food, toiletries and cleaning supplies amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedFoodAndToiletriesAmountSubError).toContainText(
      'Food, toiletries and cleaning supplies amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedMobilePhoneAmountMainError).toHaveText(
      'Mobile phone amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedMobilePhoneAmountSubError).toContainText(
      'Mobile phone amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedTravelAmountMainError).toHaveText(
      'Travel amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedTravelAmountSubError).toContainText(
      'Travel amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedClothingAndFootwearAmountMainError).toHaveText(
      'Clothing and footwear amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedClothingAndFootwearAmountSubError).toContainText(
      'Clothing and footwear amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedUniversalCreditDeductionsAmountMainError).toHaveText(
      'Universal Credit deductions must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedUniversalCreditDeductionsAmountSubError).toContainText(
      'Universal Credit deductions must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedTotalOutgoingsMainError).toHaveText(
      'Other outgoings amount must be in pounds and pence; for example £100.00',
    );
    await expect(this.combinedTotalOutgoingsSubError).toContainText(
      'Other outgoings amount must be in pounds and pence; for example £100.00',
    );
    await this.clickMoneySpentCheckboxes();
  }
}
