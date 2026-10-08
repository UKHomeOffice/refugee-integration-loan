import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
import { ConstantsLib } from '../utility-helper/constants-lib';
export class RilHowWouldYouLikeUsToContactYouPage extends basePage {
  readonly contactYouPageHeaderText: Locator;
  readonly selectAtLeastOneOptionText: Locator;
  readonly emailLabel: Locator;
  readonly emailAddressLabel: Locator;
  readonly emailAddressInput: Locator;
  readonly phoneLabel: Locator;
  readonly phoneNumberText: Locator;
  readonly internationalNumbersText: Locator;
  readonly phoneNumberInput: Locator;
  readonly contactYouBackNavBtn: Locator;
  readonly noOptionsSelectedMainError: Locator;
  readonly noOptionsSelectedSubError: Locator;
  readonly emailMainError: Locator;
  readonly emailSubError: Locator;
  readonly phoneMainError: Locator;
  readonly phoneSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.contactYouPageHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.selectAtLeastOneOptionText = page.locator('div#contactTypes-hint').first();
    this.emailLabel = page.locator("label[for='contactTypes-email']").first();
    this.emailAddressLabel = page.locator("label[for='email']").first();
    this.emailAddressInput = page.locator('input#email').first();
    this.phoneLabel = page.locator("label[for='contactTypes-phone']").first();
    this.phoneNumberText = page.locator("label[for='phone']").first();
    this.internationalNumbersText = this.hintLocator('span#phone-hint');
    this.phoneNumberInput = page.locator('input#phone').first();
    this.contactYouBackNavBtn = page.locator("a[href='/apply/bank-details']").first();
    this.noOptionsSelectedMainError = page.locator("a[href='#contactTypes-email']").first();
    this.noOptionsSelectedSubError = page.locator('p#contactTypes-error').first();
    this.emailMainError = page.locator("a[href='#email']").first();
    this.emailSubError = page.locator('div#email-group>p').first();
    this.phoneMainError = page.locator("a[href='#phone']").first();
    this.phoneSubError = page.locator('div#phone-group>p').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'How would you like us to contact you? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateHowWouldYouLikeUsToContactYouPageContent(): Promise<void> {
    await expect(this.contactYouBackNavBtn).toBeVisible();
    await this.selectCheckboxes();
    await expect(this.contactYouPageHeaderText).toHaveText('How would you like us to contact you?');
    await expect(this.selectAtLeastOneOptionText).toHaveText('Select at least one option.');
    await expect(this.emailLabel).toHaveText('Email');
    await expect(this.emailAddressLabel).toHaveText('Email address');
    await expect(this.phoneLabel).toHaveText('Phone');
    await expect(this.phoneNumberText).toHaveText('Phone number');
    await expect(this.internationalNumbersText).toHaveText('For international numbers include the country code');
    await this.getContinueButton();
    await this.selectCheckboxes();
  }
  async selectCheckboxes(): Promise<void> {
    await this.getContinueButton();
    await this.getJavascriptCheckBox('Email').click();
    await this.getJavascriptCheckBox('Phone').click();
  }
  async validateHowWouldYouLikeUsToContactYouPageErrors(): Promise<void> {
    await expect(this.contactYouBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.noOptionsSelectedMainError).toHaveText('Select how we can contact you');
    await expect(this.noOptionsSelectedSubError).toContainText('Select how we can contact you');
    await this.getContinueButton();
    await this.selectCheckboxes();
    await this.enterHowDoYouLikeUsToContactYouPage(ConstantsLib.EMPTY_VALUE, ConstantsLib.EMPTY_VALUE);
    await expect(this.emailMainError).toHaveText('Enter your email address');
    await expect(this.emailSubError).toContainText('Enter your email address');
    await expect(this.phoneMainError).toHaveText('Enter your phone number in the correct format');
    await expect(this.phoneSubError).toContainText('Enter your phone number in the correct format');
    await this.enterHowDoYouLikeUsToContactYouPage(ConstantsLib.INVALID_EMAIL, ConstantsLib.PHONE_WITH_LETTERS);
    await expect(this.emailMainError).toHaveText('Enter your email address');
    await expect(this.emailSubError).toContainText('Enter your email address');
    await this.getContinueButton();
    await this.selectCheckboxes();
  }
  async enterHowDoYouLikeUsToContactYouPage(email: string, phone: string): Promise<void> {
    await this.getContinueButton();
    await this.clearAndEnterTextInElement(this.emailAddressInput, email);
    await this.clearAndEnterTextInElement(this.phoneNumberInput, phone);
    await this.clickContinue();
  }
  async completeHowWouldYouLikeUsToContactYouPage(email: string, phone: string): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.selectCheckboxes();
    await this.enterHowDoYouLikeUsToContactYouPage(email, phone);
  }
}
