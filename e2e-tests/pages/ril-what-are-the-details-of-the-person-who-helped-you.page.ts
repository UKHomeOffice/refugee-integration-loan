import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
import { ConstantsLib } from '../utility-helper/constants-lib';
export class RilWhatAreTheDetailsOfThePersonWhoHelpedYouPage extends basePage {
  readonly detailsOfThePersonWhoHelpedYouHeaderText: Locator;
  readonly fullNameText: Locator;
  readonly fullNameInput: Locator;
  readonly relationshipToYouText: Locator;
  readonly relationshipToYouInput: Locator;
  readonly weContactThemText: Locator;
  readonly weContactThemHintText: Locator;
  readonly emailLabel: Locator;
  readonly emailAddressLabel: Locator;
  readonly emailAddressInput: Locator;
  readonly phoneLabel: Locator;
  readonly phoneNumberText: Locator;
  readonly phoneNumberInput: Locator;
  readonly personWhoHelpedYouBackNavBtn: Locator;
  readonly personWhoHelpedYouMainError: Locator;
  readonly personWhoHelpedYouSubError: Locator;
  readonly personRelationshipMainError: Locator;
  readonly personRelationshipSubError: Locator;
  readonly contactPersonWhoHelpedYouMainError: Locator;
  readonly contactPersonWhoHelpedYouSubError: Locator;
  readonly contactEmailMainError: Locator;
  readonly contactEmailSubError: Locator;
  readonly contactPhoneMainError: Locator;
  readonly contactPhoneSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.detailsOfThePersonWhoHelpedYouHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.fullNameText = page.locator("label[for='helpFullName']").first();
    this.fullNameInput = page.locator('input#helpFullName').first();
    this.relationshipToYouText = page.locator("label[for='helpRelationship']").first();
    this.relationshipToYouInput = page.locator('input#helpRelationship').first();
    this.weContactThemText = page.locator("legend[class='govuk-fieldset__legend ']").first();
    this.weContactThemHintText = page.locator('div#helpContactTypes-hint').first();
    this.emailLabel = page.locator("label[for='helpContactTypes-email']").first();
    this.emailAddressLabel = page.locator("label[for='helpEmail']").first();
    this.emailAddressInput = page.locator('input#helpEmail').first();
    this.phoneLabel = page.locator("label[for='helpContactTypes-phone']").first();
    this.phoneNumberText = page.locator("label[for='helpPhone']").first();
    this.phoneNumberInput = page.locator('input#helpPhone').first();
    this.personWhoHelpedYouBackNavBtn = page.locator("a[href='/apply/help-reasons']").first();
    this.personWhoHelpedYouMainError = page.locator("a[href='#helpFullName']").first();
    this.personWhoHelpedYouSubError = page.locator('div#helpFullName-group>p').first();
    this.personRelationshipMainError = page.locator("a[href='#helpRelationship']").first();
    this.personRelationshipSubError = page.locator('div#helpRelationship-group>p').first();
    this.contactPersonWhoHelpedYouMainError = page.locator("a[href='#helpContactTypes-email']").first();
    this.contactPersonWhoHelpedYouSubError = page.locator('p#helpContactTypes-error').first();
    this.contactEmailMainError = page.locator("a[href='#helpEmail']").first();
    this.contactEmailSubError = page.locator('div#helpEmail-group>p').first();
    this.contactPhoneMainError = page.locator("a[href='#helpPhone']").first();
    this.contactPhoneSubError = page.locator('div#helpPhone-group>p').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'What are the details of the person who helped you? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validatePersonWhoHelpedYouPageContent(): Promise<void> {
    await expect(this.personWhoHelpedYouBackNavBtn).toBeVisible();
    await this.selectCheckboxes();
    await expect(this.detailsOfThePersonWhoHelpedYouHeaderText).toHaveText(
      'What are the details of the person who helped you?',
    );
    await expect(this.fullNameText).toHaveText('Full name');
    await expect(this.relationshipToYouText).toHaveText('Relationship to you');
    await expect(this.weContactThemText).toHaveText('How can we contact them?');
    await expect(this.weContactThemHintText).toHaveText(
      'We may need to get in contact with them if we need more information. Select at least one option.',
    );
    await expect(this.emailLabel).toHaveText('Email');
    await expect(this.emailAddressLabel).toHaveText('Email address');
    await expect(this.phoneLabel).toHaveText('Phone');
    await expect(this.phoneNumberText).toHaveText('UK telephone number');
    await this.selectCheckboxes();
  }
  async validatePersonWhoHelpedYouPageErrors(): Promise<void> {
    await expect(this.personWhoHelpedYouBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.personWhoHelpedYouMainError).toHaveText('Enter the full name of the person who helped you');
    await expect(this.personWhoHelpedYouSubError).toContainText('Enter the full name of the person who helped you');
    await expect(this.personRelationshipMainError).toHaveText("Enter the person's relationship to you");
    await expect(this.personRelationshipSubError).toContainText("Enter the person's relationship to you");
    await expect(this.contactPersonWhoHelpedYouMainError).toHaveText(
      'Select how we can contact the person who helped you',
    );
    await expect(this.contactPersonWhoHelpedYouSubError).toContainText(
      'Select how we can contact the person who helped you',
    );
    await this.getContinueButton();
    await this.selectCheckboxes();
    await this.enterPersonWhoHelpedYouDetails(
      ConstantsLib.INPUT_HELPER_FULL_NAME,
      ConstantsLib.INPUT_HELPER_RELATIONSHIP,
      ConstantsLib.EMPTY_VALUE,
      ConstantsLib.EMPTY_VALUE,
    );
    await expect(this.contactEmailMainError).toHaveText("Enter the person's email address");
    await expect(this.contactEmailSubError).toContainText("Enter the person's email address");
    await expect(this.contactPhoneMainError).toHaveText("Enter the person's phone number");
    await expect(this.contactPhoneSubError).toContainText("Enter the person's phone number");
    await this.enterPersonWhoHelpedYouDetails(
      ConstantsLib.INPUT_HELPER_FULL_NAME,
      ConstantsLib.INPUT_HELPER_RELATIONSHIP,
      ConstantsLib.INVALID_EMAIL,
      ConstantsLib.INVALID_HELPER_PHONE,
    );
    await expect(this.contactEmailMainError).toHaveText("Enter the person's email address");
    await expect(this.contactEmailSubError).toContainText("Enter the person's email address");
    await this.getContinueButton();
    await this.selectCheckboxes();
  }
  async selectCheckboxes(): Promise<void> {
    await this.getContinueButton();
    await this.getJavascriptCheckBox('Email').click();
    await this.getJavascriptCheckBox('Phone').click();
  }
  async enterPersonWhoHelpedYouDetails(
    fullName: string,
    relationship: string,
    email: string,
    phone: string,
  ): Promise<void> {
    await this.getContinueButton();
    await this.clearAndEnterTextInElement(this.fullNameInput, fullName);
    await this.clearAndEnterTextInElement(this.relationshipToYouInput, relationship);
    await this.clearAndEnterTextInElement(this.emailAddressInput, email);
    await this.clearAndEnterTextInElement(this.phoneNumberInput, phone);
    await this.clickContinue();
  }
  async completePersonWhoHelpedYouPage(
    fullName: string,
    relationship: string,
    email: string,
    phone: string,
  ): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.selectCheckboxes();
    await this.enterPersonWhoHelpedYouDetails(fullName, relationship, email, phone);
  }
}
