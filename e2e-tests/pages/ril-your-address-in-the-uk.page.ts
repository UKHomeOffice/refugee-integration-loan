import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
import { ConstantsLib } from '../utility-helper/constants-lib';
export class RilYourAddressInTheUKPage extends basePage {
  readonly yourAddressPageHeaderText: Locator;
  readonly yourAddressText: Locator;
  readonly buildingAndStreetText: Locator;
  readonly buildingInput: Locator;
  readonly streetInput: Locator;
  readonly townOrCityText: Locator;
  readonly townOrCityInput: Locator;
  readonly postcodeText: Locator;
  readonly postcodeInput: Locator;
  readonly buildingMainError: Locator;
  readonly buildingSubError: Locator;
  readonly townOrCityMainError: Locator;
  readonly townOrCitySubError: Locator;
  readonly postcodeMainError: Locator;
  readonly postcodeSubError: Locator;
  constructor(page: Page) {
    super(page);
    this.yourAddressPageHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.yourAddressText = page.locator('div#gov-grid-row-content>div>form>p').first();
    this.buildingAndStreetText = page.locator('div#building-group>label').first();
    this.buildingInput = page.locator('div#building-group>input').first();
    this.streetInput = page.locator('div#street-group>input').first();
    this.townOrCityText = page.locator('div#townOrCity-group>label').first();
    this.townOrCityInput = page.locator('div#townOrCity-group>input').first();
    this.postcodeText = page.locator('div#postcode-group>label').first();
    this.postcodeInput = page.locator('div#postcode-group>input').first();
    this.buildingMainError = page.locator("a[href='#building']").first();
    this.buildingSubError = page.locator('div#building-group>p').first();
    this.townOrCityMainError = page.locator("a[href='#townOrCity']").first();
    this.townOrCitySubError = page.locator('div#townOrCity-group>p').first();
    this.postcodeMainError = page.locator("a[href='#postcode']").first();
    this.postcodeSubError = page.locator('div#postcode-group>p').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'What is your address in the UK? – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateYourAddressPageContent(): Promise<void> {
    await this.getContinueButton();
    await expect(this.yourAddressPageHeaderText).toHaveText('What is your address in the UK?');
    await expect(this.yourAddressText).toHaveText(
      'If you have no fixed address, enter an address where we can contact you.',
    );
    await expect(this.buildingAndStreetText).toHaveText('Building and street');
    await expect(this.townOrCityText).toHaveText('Town or city');
    await expect(this.postcodeText).toHaveText('Postcode');
  }
  async validateYourAddressPageErrors(): Promise<void> {
    await this.getContinueButton();
    await this.clickContinue();
    await expect(this.buildingMainError).toHaveText('Enter details of your building and street');
    await expect(this.buildingSubError).toContainText('Enter details of your building and street');
    await expect(this.townOrCityMainError).toHaveText('Enter a town or city');
    await expect(this.townOrCitySubError).toContainText('Enter a town or city');
    await expect(this.postcodeMainError).toHaveText('Enter your postcode');
    await expect(this.postcodeSubError).toContainText('Enter your postcode');
    await this.enterAddressDetails(
      ConstantsLib.INVALID_POSTCODE_BUILDING,
      ConstantsLib.INVALID_POSTCODE_STREET,
      ConstantsLib.INVALID_POSTCODE_CITY,
      ConstantsLib.NUMERIC_POSTCODE,
    );
    await expect(this.postcodeMainError).toHaveText('Enter your postcode');
    await expect(this.postcodeSubError).toContainText('Enter your postcode');
    await this.enterAddressDetails(ConstantsLib.BUILDING, ConstantsLib.STREET, ConstantsLib.CITY, ConstantsLib.SHORT_POSTCODE);
    await expect(this.postcodeMainError).toHaveText('Enter your postcode');
    await expect(this.postcodeSubError).toContainText('Enter your postcode');
  }
  async enterAddressDetails(building: string, street: string, town: string, postcode: string): Promise<void> {
    await this.getContinueButton();
    await this.clearAndEnterTextInElement(this.buildingInput, building);
    await this.clearAndEnterTextInElement(this.streetInput, street);
    await this.clearAndEnterTextInElement(this.townOrCityInput, town);
    await this.clearAndEnterTextInElement(this.postcodeInput, postcode);
    await this.clickContinue();
  }
}
