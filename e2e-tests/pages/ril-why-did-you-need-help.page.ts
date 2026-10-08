import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilWhyDidYouNeedHelpPage extends basePage {
  readonly whyDidYouNeedHelpHeaderText: Locator;
  readonly selectAllThatApplyText: Locator;
  readonly toTheInterestLabel: Locator;
  readonly myFirstLanguageLabel: Locator;
  readonly theQuestionsCorrectlyLabel: Locator;
  readonly completeTheApplicationLabel: Locator;
  readonly formOnlineApplicationLabel: Locator;
  readonly whyDidYouNeedHelpBackNavBtn: Locator;
  readonly whyDidYouNeedHelpMainError: Locator;
  readonly whyDidYouNeedHelpSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.whyDidYouNeedHelpHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.selectAllThatApplyText = page.locator('div#helpReasons-hint').first();
    this.toTheInterestLabel = page.locator("label[for='helpReasons-no_internet']").first();
    this.myFirstLanguageLabel = page.locator("label[for='helpReasons-english_not_first_language']").first();
    this.theQuestionsCorrectlyLabel = page.locator("label[for='helpReasons-not_confident']").first();
    this.completeTheApplicationLabel = page.locator("label[for='helpReasons-faster']").first();
    this.formOnlineApplicationLabel = page.locator("label[for='helpReasons-health_condition']").first();
    this.whyDidYouNeedHelpBackNavBtn = page.locator("a[href='/apply/help']").first();
    this.whyDidYouNeedHelpMainError = page.locator("a[href='#helpReasons-no_internet']").first();
    this.whyDidYouNeedHelpSubError = page.locator('p#helpReasons-error').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Why did you need help? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateWhyDidYouNeedHelpPageContent(): Promise<void> {
    await expect(this.whyDidYouNeedHelpBackNavBtn).toBeVisible();
    await expect(this.whyDidYouNeedHelpHeaderText).toHaveText('Why did you need help?');
    await expect(this.selectAllThatApplyText).toHaveText('Select all that apply.');
    await expect(this.toTheInterestLabel).toHaveText('I don\u2019t have access to the internet');
    await expect(this.myFirstLanguageLabel).toHaveText('English is not my first language');
    await expect(this.theQuestionsCorrectlyLabel).toHaveText(
      'I\u2019m not confident to answer the questions correctly',
    );
    await expect(this.completeTheApplicationLabel).toHaveText('It was faster to complete the application');
    await expect(this.formOnlineApplicationLabel).toHaveText(
      'I have a health condition which makes completing the form online difficult',
    );
  }
  async validateWhyDidYouNeedHelpPageErrors(): Promise<void> {
    await expect(this.whyDidYouNeedHelpBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.whyDidYouNeedHelpMainError).toHaveText('Select why you needed help');
    await expect(this.whyDidYouNeedHelpSubError).toContainText('Select why you needed help');
  }
  async selectWhyDidYouNeedHelpPageOptions(options: string): Promise<void> {
    await this.getContinueButton();
    const optionsList = options.split('-');
    for (const option of optionsList) {
      switch (option) {
        case 'Access to Internet':
          await this.getJavascriptCheckBox('I don\u2019t have access to the internet').click();
          break;
        case 'First Language':
          await this.getJavascriptCheckBox('English is not my first language').click();
          break;
        case 'Questions Correctly':
          await this.getJavascriptCheckBox('I\u2019m not confident to answer the questions correctly').click();
          break;
        case 'Complete the Application':
          await this.getJavascriptCheckBox('It was faster to complete the application').click();
          break;
        case 'Online Difficulty':
          await this.getJavascriptCheckBox(
            'I have a health condition which makes completing the form online difficult',
          ).click();
          break;
        default:
          throw new Error('Invalid option: ' + option);
      }
    }
    await this.clickContinue();
  }
}
