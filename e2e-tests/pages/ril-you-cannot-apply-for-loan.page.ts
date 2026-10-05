import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilYouCannotApplyForLoanPage extends basePage {
  readonly yourAddressAppliedForAnIntegrationLoanBeforeHeaderText: Locator;
  readonly yourAddressAppliedForAnIntegrationLoanBeforeYesLabel: Locator;
  readonly yourAddressAppliedForAnIntegrationLoanBeforeNoLabel: Locator;
  readonly youCannotApplyForLoanBackNavBtn: Locator;
  constructor(page: Page) {
    super(page);
    this.yourAddressAppliedForAnIntegrationLoanBeforeHeaderText = page
      .locator('div#gov-grid-row-content>div>h1')
      .first();
    this.yourAddressAppliedForAnIntegrationLoanBeforeYesLabel = page
      .locator('div#gov-grid-row-content>div>form>p:nth-of-type(1)')
      .first();
    this.yourAddressAppliedForAnIntegrationLoanBeforeNoLabel = page
      .locator('div#gov-grid-row-content>div>form>p:nth-of-type(2)')
      .first();
    this.youCannotApplyForLoanBackNavBtn = page.locator("a[href='/apply/who-received-previous-loan']").first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'You cannot apply for a loan – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateYouCannotApplyForLoanPageContent(): Promise<void> {
    await expect(this.youCannotApplyForLoanBackNavBtn).toBeVisible();
    await this.verifyTextToAppear('You cannot apply for a loan');
    await this.verifyTextToAppear(
      'As you or your partner have already received an integration loan, you cannot apply again.',
    );
    await this.verifyTextToAppear(
      'Your local refugee community organisation may be able to tell you what other support is available.',
    );
    await expect(this.yourAddressAppliedForAnIntegrationLoanBeforeHeaderText).toHaveText('You cannot apply for a loan');
    await expect(this.yourAddressAppliedForAnIntegrationLoanBeforeYesLabel).toHaveText(
      'As you or your partner have already received an integration loan, you cannot apply again.',
    );
    await expect(this.yourAddressAppliedForAnIntegrationLoanBeforeNoLabel).toHaveText(
      'Your local refugee community organisation may be able to tell you what other support is available.',
    );
  }
  async returnToPreviousLoanPage(): Promise<void> {
    await this.click(this.youCannotApplyForLoanBackNavBtn);
  }
}
