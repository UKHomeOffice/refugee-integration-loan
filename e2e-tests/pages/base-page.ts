import { expect, Locator, Page } from '@playwright/test';
export class basePage {
  readonly headerText: Locator;
  readonly continueButton: Locator;
  readonly thereIsAProblemText: Locator;
  readonly errorSummaryList: Locator;

  static randomAlphabet(length: number): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  }

  constructor(readonly page: Page) {
    this.headerText = page.locator('h1');
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.thereIsAProblemText = page.locator('#error-summary-title');
    this.errorSummaryList = page.locator('.govuk-error-summary__list');
  }

  async assertPageTitle(page: Page, title: string): Promise<void> {
    await expect(page).toHaveTitle(title);
  }

  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  async type(locator: Locator, text: string): Promise<void> {
    await locator.fill('');
    if (text) await locator.pressSequentially(text);
    await locator.press('Tab');
  }

  async clearAndEnterTextInElement(locator: Locator, text: string): Promise<void> {
    await this.type(locator, text);
  }

  hintLocator(sourceSelector: string): Locator {
    return this.page
      .locator(sourceSelector)
      .or(this.page.locator(sourceSelector.replace(/^(span|div)/, '')))
      .first();
  }

  async completeTextPage(locator: Locator, value: string): Promise<void> {
    await this.type(locator, value);
    await this.clickContinueButton();
  }

  async selectCheckboxOptionWithText(optionText: string): Promise<void> {
    await this.page.getByRole('checkbox', { name: optionText }).check();
  }

  async completeCheckboxPage(options: readonly string[]): Promise<void> {
    for (const option of options) {
      await this.selectCheckboxOptionWithText(option);
    }
    await this.clickContinueButton();
  }

  async getContinueButton(): Promise<Locator> {
    await expect(this.continueButton).toBeVisible();
    return this.continueButton;
  }

  async completeRadioPage(option: string): Promise<void> {
    await this.getContinueButton();
    await this.getJavascriptCheckBox(option).click();
    await this.clickContinue();
  }

  getJavascriptCheckBox(label: string): Locator {
    if (!label.trim()) throw new Error('Radio or checkbox label cannot be empty');
    return this.page
      .getByRole('radio', { name: label })
      .or(this.page.getByRole('checkbox', { name: label }))
      .first();
  }

  async enterDateOrDob(inputDate: string): Promise<void> {
    if (!inputDate.trim()) return;
    const dateParts = inputDate.split('/');
    if (dateParts.length !== 3) throw new Error('Invalid date format. Expected dd/MM/yyyy');
    await this.type(this.page.getByLabel('Day', { exact: true }), dateParts[0]);
    await this.type(this.page.getByLabel('Month', { exact: true }), dateParts[1]);
    await this.type(this.page.getByLabel('Year', { exact: true }), dateParts[2]);
  }

  async verifyTextToAppear(text: string): Promise<void> {
    await expect(this.page.getByText(text, { exact: true }).first()).toBeVisible();
  }

  async acceptCookies(): Promise<void> {
    const accept = this.page.getByRole('button', { name: 'Accept additional cookies', exact: true });
    if (!(await accept.isVisible())) {
      await this.page.context().clearCookies();
      await this.page.reload();
    }
    await accept.click();
    const hide = this.page.getByRole('button', { name: /^Hide / });
    await expect(hide).toBeVisible();
    await hide.click();
    await expect(hide).toBeHidden();
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }
  
  async clickContinueButton(): Promise<void> {
    await this.clickContinue();
  }
}
