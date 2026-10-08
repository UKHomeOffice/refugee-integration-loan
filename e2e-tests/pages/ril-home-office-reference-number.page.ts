import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilHomeOfficeReferenceNumberPage extends basePage {
  readonly homeOfficeReferenceNumberHeaderText: Locator;
  readonly homeOfficeReferenceNumberLabel: Locator;
  readonly homeOfficeReferenceNumberHintText: Locator;
  readonly homeOfficeReferenceNumberInput: Locator;
  readonly homeOfficeReferenceNumberBackNavBtn: Locator;
  readonly homeOfficeReferenceNumberMainError: Locator;
  readonly homeOfficeReferenceNumberSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.homeOfficeReferenceNumberHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.homeOfficeReferenceNumberLabel = page.locator("label[for='homeOfficeReference']").first();
    this.homeOfficeReferenceNumberHintText = this.hintLocator('span#homeOfficeReference-hint');
    this.homeOfficeReferenceNumberInput = page.locator('input#homeOfficeReference').first();
    this.homeOfficeReferenceNumberBackNavBtn = page.locator("a[href='/apply/other-names']").first();
    this.homeOfficeReferenceNumberMainError = page.locator("a[href='#homeOfficeReference']").first();
    this.homeOfficeReferenceNumberSubError = page.locator('div#homeOfficeReference-group>p').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'What is your Home Office reference number? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateHomeOfficeReferenceNumberPageContent(): Promise<void> {
    await expect(this.homeOfficeReferenceNumberBackNavBtn).toBeVisible();
    await expect(this.homeOfficeReferenceNumberHeaderText).toHaveText('What is your Home Office reference number?');
    await expect(this.homeOfficeReferenceNumberLabel).toHaveText('Home Office reference number');
    await expect(this.homeOfficeReferenceNumberHintText).toHaveText(
      'For example, \u2018A1234567\u2019 or \u2018VPR1234\u2019. You can find this on your asylum application letter from the Home Office. It\u2019s sometimes called \u2018Case ID\u2019.',
    );
  }
  async validateHomeOfficeReferenceNumberPageErrors(): Promise<void> {
    await expect(this.homeOfficeReferenceNumberBackNavBtn).toBeVisible();
    await this.getContinueButton();
    await this.clickContinue();
    await expect(this.homeOfficeReferenceNumberMainError).toHaveText(
      'Enter a Home Office reference number in the correct format; for example, \u2018A1234567\u2019 or \u2018VPR1234\u2019',
    );
    await expect(this.homeOfficeReferenceNumberSubError).toContainText(
      'Enter a Home Office reference number in the correct format; for example, \u2018A1234567\u2019 or \u2018VPR1234\u2019',
    );
  }
  async completeHomeOfficeReferenceNumberPage(value: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.completeTextPage(this.homeOfficeReferenceNumberInput, value);
  }
}
