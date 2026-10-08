import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilYouGetAnyHelpMakingThisApplicationPage extends basePage {
  readonly anyHelpMakingThisApplicationHeaderText: Locator;
  readonly anyHelpMakingThisApplicationYesLabel: Locator;
  readonly anyHelpMakingThisApplicationNoLabel: Locator;
  readonly anyHelpMakingThisApplicationBackNavBtn: Locator;
  readonly anyHelpMakingThisApplicationMainError: Locator;
  readonly anyHelpMakingThisApplicationSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.anyHelpMakingThisApplicationHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.anyHelpMakingThisApplicationYesLabel = page.locator("label[for='hadHelp-yes']").first();
    this.anyHelpMakingThisApplicationNoLabel = page.locator("label[for='hadHelp-no']").first();
    this.anyHelpMakingThisApplicationBackNavBtn = page.locator("a[href='/apply/contact']").first();
    this.anyHelpMakingThisApplicationMainError = page.locator("a[href='#hadHelp-yes']").first();
    this.anyHelpMakingThisApplicationSubError = page.locator('p#hadHelp-error').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Did you get any help making this application? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateYouGetAnyHelpMakingThisApplicationPageContent(): Promise<void> {
    await expect(this.anyHelpMakingThisApplicationBackNavBtn).toBeVisible();
    await expect(this.anyHelpMakingThisApplicationHeaderText).toHaveText(
      'Did you get any help making this application?',
    );
    await expect(this.anyHelpMakingThisApplicationYesLabel).toHaveText('Yes');
    await expect(this.anyHelpMakingThisApplicationNoLabel).toHaveText('No');
  }
  async validateYouGetAnyHelpMakingThisApplicationPageErrors(): Promise<void> {
    await expect(this.anyHelpMakingThisApplicationBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.anyHelpMakingThisApplicationMainError).toHaveText(
      'Select if you had any help making this application',
    );
    await expect(this.anyHelpMakingThisApplicationSubError).toContainText(
      'Select if you had any help making this application',
    );
  }
  async completeYouGetAnyHelpMakingThisApplicationPage(option: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.completeRadioPage(option);
  }
}
