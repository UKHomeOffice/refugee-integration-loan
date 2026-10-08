import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilCombinedWhatWillYouUseTheLoanForPage extends basePage {
  readonly combinedUseTheLoanForHeaderText: Locator;
  readonly combinedSelectTheAllOptionsText: Locator;
  readonly combinedHousingLabel: Locator;
  readonly combinedDepositRentPaymentText: Locator;
  readonly combinedEssentialItemsLabel: Locator;
  readonly combinedFurnitureFridgeText: Locator;
  readonly combinedLivingCostsLabel: Locator;
  readonly combinedHouseholdBillsText: Locator;
  readonly combinedTrainingEducationLabel: Locator;
  readonly combinedWorkClothingLabel: Locator;
  readonly combinedMoneySpentBackNavBtn: Locator;
  readonly combinedMoneyReceiveEachMonthMainError: Locator;
  readonly combinedMoneyReceiveEachMonthSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.combinedUseTheLoanForHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.combinedSelectTheAllOptionsText = page.locator('div#purposeTypes-hint').first();
    this.combinedHousingLabel = page.locator("label[for='purposeTypes-housing']").first();
    this.combinedDepositRentPaymentText = page.locator('div#purposeTypes-housing-item-hint').first();
    this.combinedEssentialItemsLabel = page.locator("label[for='purposeTypes-essential_items']").first();
    this.combinedFurnitureFridgeText = page.locator('div#purposeTypes-essential_items-item-hint').first();
    this.combinedLivingCostsLabel = page.locator("label[for='purposeTypes-basic_living_costs']").first();
    this.combinedHouseholdBillsText = page.locator('div#purposeTypes-basic_living_costs-item-hint').first();
    this.combinedTrainingEducationLabel = page.locator("label[for='purposeTypes-training_or_retraining']").first();
    this.combinedWorkClothingLabel = page.locator("label[for='purposeTypes-work_clothing_and_equipment']").first();
    this.combinedMoneySpentBackNavBtn = page.locator("a[href='/apply/combined-amount']").first();
    this.combinedMoneyReceiveEachMonthMainError = page.locator("a[href='#purposeTypes-housing']").first();
    this.combinedMoneyReceiveEachMonthSubError = page.locator('p#purposeTypes-error').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'What will you use the loan for? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateCombinedWhatWillYouUseTheLoanForPageContent(): Promise<void> {
    await this.getContinueButton();
    await expect(this.combinedUseTheLoanForHeaderText).toHaveText('What will you use the loan for?');
    await expect(this.combinedSelectTheAllOptionsText).toHaveText('Select all options that apply to you.');
    await expect(this.combinedHousingLabel).toContainText('Housing');
    await expect(this.combinedDepositRentPaymentText).toHaveText('Deposit, rent payment or moving costs.');
    await expect(this.combinedEssentialItemsLabel).toContainText('Essential items');
    await expect(this.combinedFurnitureFridgeText).toHaveText('For example, furniture, fridge, curtains or carpets.');
    await expect(this.combinedLivingCostsLabel).toContainText('Basic living costs');
    await expect(this.combinedHouseholdBillsText).toHaveText('For example, food or household bills.');
    await expect(this.combinedTrainingEducationLabel).toHaveText('Training or education');
    await expect(this.combinedWorkClothingLabel).toHaveText('Work clothing and equipment');
  }
  async validateCombinedWhatWillYouUseTheLoanForPageErrors(): Promise<void> {
    await expect(this.combinedMoneySpentBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.combinedMoneyReceiveEachMonthMainError).toHaveText('Select what you will use the loan for');
    await expect(this.combinedMoneyReceiveEachMonthSubError).toContainText('Select what you will use the loan for');
  }
  async completeCombinedWhatWillYouUseTheLoanForPage(options: readonly string[]): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.completeCheckboxPage(options);
  }
}
