import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
import { ConstantsLib } from '../utility-helper/constants-lib';
export class RilEnterDetailsOfYourDependantPage extends basePage {
  readonly detailsOfDependantHeaderText: Locator;
  readonly addMoreDependantsLaterText: Locator;
  readonly fullNameLabel: Locator;
  readonly fullNameInput: Locator;
  readonly dependantDobText: Locator;
  readonly dependantDobExampleText: Locator;
  readonly dependantDayText: Locator;
  readonly dependantMonthText: Locator;
  readonly dependantYearText: Locator;
  readonly dependantRelationshipText: Locator;
  readonly dependantRelationshipInput: Locator;
  readonly detailsOfDependantBackNavBtn: Locator;
  readonly dependantFullNameMainError: Locator;
  readonly dependantFullNameSubError: Locator;
  readonly dependantDobMainError: Locator;
  readonly dependantDobSubError: Locator;
  readonly dependantRelationshipMainError: Locator;
  readonly dependantRelationshipSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.detailsOfDependantHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.addMoreDependantsLaterText = page.locator('div#gov-grid-row-content>div>form>p').first();
    this.fullNameLabel = page.locator("label[for='dependantFullName']").first();
    this.fullNameInput = page.locator('input#dependantFullName').first();
    this.dependantDobText = page.locator('fieldset#dependantDateOfBirth-group>legend').first();
    this.dependantDobExampleText = this.hintLocator('span#dependantDateOfBirth-hint');
    this.dependantDayText = page.locator("label[for='dependantDateOfBirth-day']").first();
    this.dependantMonthText = page.locator("label[for='dependantDateOfBirth-month']").first();
    this.dependantYearText = page.locator("label[for='dependantDateOfBirth-year']").first();
    this.dependantRelationshipText = page.locator("label[for='dependantRelationship']").first();
    this.dependantRelationshipInput = page.locator('input#dependantRelationship').first();
    this.detailsOfDependantBackNavBtn = page.locator("a[href='/apply/has-dependants']").first();
    this.dependantFullNameMainError = page.locator("a[href='#dependantFullName']").first();
    this.dependantFullNameSubError = page.locator('div#dependantFullName-group>p').first();
    this.dependantDobMainError = page.locator("a[href='#dependantDateOfBirth-day']").first();
    this.dependantDobSubError = page.locator('p#dependantDateOfBirth-error').first();
    this.dependantRelationshipMainError = page.locator("a[href='#dependantRelationship']").first();
    this.dependantRelationshipSubError = page.locator('div#dependantRelationship-group>p').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Enter details of your dependant – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateDetailsOfYourDependantPageContent(): Promise<void> {
    await expect(this.detailsOfDependantBackNavBtn).toBeVisible();
    await expect(this.detailsOfDependantHeaderText).toHaveText('Enter details of your dependant');
    await expect(this.addMoreDependantsLaterText).toHaveText('You can add more dependants later.');
    await expect(this.fullNameLabel).toHaveText('Full name');
    await expect(this.dependantDobText).toHaveText('Date of Birth');
    await expect(this.dependantDobExampleText).toHaveText('For example, 31 3 1980');
    await expect(this.dependantDayText).toHaveText('Day');
    await expect(this.dependantMonthText).toHaveText('Month');
    await expect(this.dependantYearText).toHaveText('Year');
    await expect(this.dependantRelationshipText).toHaveText('Relationship to you');
  }
  async validateDetailsOfYourDependantPageErrors(): Promise<void> {
    await expect(this.detailsOfDependantBackNavBtn).toBeVisible();
    await this.clickContinue();
    await expect(this.dependantFullNameMainError).toHaveText("Enter dependant's full name");
    await expect(this.dependantFullNameSubError).toContainText("Enter dependant's full name");
    await expect(this.dependantDobMainError).toHaveText(
      "Enter dependant's date of birth in the correct format; for example, 31 3 1980",
    );
    await expect(this.dependantDobSubError).toContainText(
      "Enter dependant's date of birth in the correct format; for example, 31 3 1980",
    );
    await expect(this.dependantRelationshipMainError).toHaveText("Enter the dependant's relationship to you");
    await expect(this.dependantRelationshipSubError).toContainText("Enter the dependant's relationship to you");
    await this.enterDetailsOfTheDependants(
      ConstantsLib.DEPENDANT_INPUT_FULL_NAME,
      ConstantsLib.INVALID_DEPENDANT_CALENDAR_DATE,
      ConstantsLib.DEPENDANT_INPUT_RELATIONSHIP,
    );
    await expect(this.dependantDobMainError).toHaveText(
      "Enter dependant's date of birth in the correct format; for example, 31 3 1980",
    );
    await expect(this.dependantDobSubError).toContainText(
      "Enter dependant's date of birth in the correct format; for example, 31 3 1980",
    );
    await this.enterDetailsOfTheDependants(
      ConstantsLib.DEPENDANT_INPUT_FULL_NAME,
      ConstantsLib.DEPENDANT_DATE_WITH_LETTER,
      ConstantsLib.DEPENDANT_INPUT_RELATIONSHIP,
    );
    await expect(this.dependantDobMainError).toHaveText(
      "Enter dependant's date of birth in the correct format; for example, 31 3 1980",
    );
    await expect(this.dependantDobSubError).toContainText(
      "Enter dependant's date of birth in the correct format; for example, 31 3 1980",
    );
  }
  async enterDetailsOfTheDependants(
    dependantFullname: string,
    dependantDob: string,
    dependantRelationship: string,
  ): Promise<void> {
    await this.getContinueButton();
    await this.clearAndEnterTextInElement(this.fullNameInput, dependantFullname);
    await this.enterDateOrDob(dependantDob);
    await this.clearAndEnterTextInElement(this.dependantRelationshipInput, dependantRelationship);
    await this.clickContinue();
  }
}
