import { Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilWhatWillYouUseTheLoanForPage extends basePage {
  readonly useTheLoanForHeaderText: Locator;
  readonly selectTheAllOptionsText: Locator;
  readonly housingLabel: Locator;
  readonly depositRentPaymentText: Locator;
  readonly essentialItemsLabel: Locator;
  readonly furnitureFridgeText: Locator;
  readonly livingCostsLabel: Locator;
  readonly householdBillsText: Locator;
  readonly trainingEducationLabel: Locator;
  readonly workClothingLabel: Locator;
  readonly moneySpentBackNavBtn: Locator;
  readonly moneyDoYouReceiveEachMonthMainError: Locator;
  readonly moneyDoYouReceiveEachMonthSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.useTheLoanForHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.selectTheAllOptionsText = page.locator('div#purposeTypes-hint').first();
    this.housingLabel = page.locator("label[for='purposeTypes-housing']").first();
    this.depositRentPaymentText = page.locator('div#purposeTypes-housing-item-hint').first();
    this.essentialItemsLabel = page.locator("label[for='purposeTypes-essential_items']").first();
    this.furnitureFridgeText = page.locator('div#purposeTypes-essential_items-item-hint').first();
    this.livingCostsLabel = page.locator("label[for='purposeTypes-basic_living_costs']").first();
    this.householdBillsText = page.locator('div#purposeTypes-basic_living_costs-item-hint').first();
    this.trainingEducationLabel = page.locator("label[for='purposeTypes-training_or_retraining']").first();
    this.workClothingLabel = page.locator("label[for='purposeTypes-work_clothing_and_equipment']").first();
    this.moneySpentBackNavBtn = page.locator("a[href='/apply/amount']").first();
    this.moneyDoYouReceiveEachMonthMainError = page.locator("a[href='#niNumber']").first();
    this.moneyDoYouReceiveEachMonthSubError = page.locator('div#niNumber-group>p').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'What will you use the loan for? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async completeWhatWillYouUseTheLoanForPage(options: readonly string[]): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.completeCheckboxPage(options);
  }
}
