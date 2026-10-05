import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilApplicationSentPage extends basePage {
  readonly confirmationBackLink: Locator;
  readonly confirmationBanner: Locator;
  readonly confirmationWhatHappensText: Locator;
  readonly confirmationWeWillContactText: Locator;
  readonly confirmationYouHaveSuccessfulText: Locator;
  readonly confirmationYouHaveUnsuccessfulText: Locator;
  readonly confirmationYourDetailsChangeText: Locator;
  readonly confirmationLetUsKnowText: Locator;
  readonly confirmationWhatDidYouThinkLink: Locator;
  readonly confirmationImproveOurServiceText: Locator;
  readonly confirmationHomeOfficeNeedsText: Locator;
  readonly confirmationYouCanSignUpText: Locator;
  readonly confirmationIfYouHelped: Locator;
  readonly confirmationWeMayGiveYouText: Locator;
  readonly confirmationFindOutMoreLink: Locator;
  readonly confirmationSignUpToTakePartBtn: Locator;
  constructor(page: Page) {
    super(page);
    this.confirmationBackLink = page.locator("a[href='/apply/confirm']").first();
    this.confirmationBanner = page.locator("h1[class='govuk-panel__title']").first();
    this.confirmationWhatHappensText = page.locator("form[method='POST']>h2:nth-of-type(1)").first();
    this.confirmationWeWillContactText = page.locator("form[method='POST']>p:nth-of-type(1)").first();
    this.confirmationYouHaveSuccessfulText = page.locator("form[method='POST']>p:nth-of-type(2)").first();
    this.confirmationYouHaveUnsuccessfulText = page.locator("form[method='POST']>p:nth-of-type(3)").first();
    this.confirmationYourDetailsChangeText = page.locator("form[method='POST']>h2:nth-of-type(2)").first();
    this.confirmationLetUsKnowText = page.locator("form[method='POST']>p:nth-of-type(4)").first();
    this.confirmationWhatDidYouThinkLink = page.locator("form[method='POST']>p:nth-of-type(5)").first();
    this.confirmationImproveOurServiceText = page.locator("form[method='POST']>h2:nth-of-type(3)").first();
    this.confirmationHomeOfficeNeedsText = page.locator("form[method='POST']>p:nth-of-type(6)").first();
    this.confirmationYouCanSignUpText = page.locator("form[method='POST']>p:nth-of-type(7)").first();
    this.confirmationIfYouHelped = page.locator("form[method='POST']>p:nth-of-type(8)").first();
    this.confirmationWeMayGiveYouText = page.locator("form[method='POST']>p:nth-of-type(9)").first();
    this.confirmationFindOutMoreLink = page.locator("form[method='POST']>p:nth-of-type(10)").first();
    this.confirmationSignUpToTakePartBtn = page.locator("form[method='POST']>a").first();
  }
  async expectedPageTitle(): Promise<string> {
    return ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') + 'Application sent – GOV.UK';
  }
  async validateApplicationSentPageContent(): Promise<void> {
    await expect(this.confirmationSignUpToTakePartBtn).toBeVisible();
    await expect(this.confirmationBanner).toContainText('Application sent');
    await expect(this.confirmationWhatHappensText).toContainText('What happens next');
    await expect(this.confirmationWeWillContactText).toHaveText(
      'We\u2019ll contact you with the decision of your application or if we need more information from you. This should happen within 4 weeks.',
    );
    await expect(this.confirmationYouHaveSuccessfulText).toHaveText(
      'If you have been successful, we will send you a loan agreement by email or post. You will need to go online to accept the terms of this agreement.',
    );
    await expect(this.confirmationYouHaveUnsuccessfulText).toHaveText(
      'If you have been unsuccessful, we will write to you explaining the reasons for this decision.',
    );
    await expect(this.confirmationYourDetailsChangeText).toHaveText('If your details change');
    await expect(this.confirmationLetUsKnowText).toHaveText(
      'To let us know about any changes in your situation, including contact details, email integrationloan@homeoffice.gov.uk',
    );
    await expect(this.confirmationWhatDidYouThinkLink).toHaveText(
      'What did you think of this service? (takes 30 seconds)',
    );
    await expect(this.confirmationImproveOurServiceText).toHaveText('Help us improve our services');
    await expect(this.confirmationHomeOfficeNeedsText).toHaveText(
      'Home Office needs your help to ensure our services work well for the people who need them.',
    );
    await expect(this.confirmationYouCanSignUpText).toHaveText(
      'You can sign up to take part in research in person and online. You do not need to be good with computers or the internet to join.',
    );
    await expect(this.confirmationIfYouHelped).toHaveText(
      'If you helped someone fill in the form, we would like to talk to you so we can improve services for you and others who provide support.',
    );
    await expect(this.confirmationWeMayGiveYouText).toHaveText('We may give you a voucher for taking part.');
    await expect(this.confirmationFindOutMoreLink).toHaveText("Find out more about what's involved");
    await expect(this.confirmationBackLink).toHaveText('Back');
    await expect(this.confirmationSignUpToTakePartBtn).toHaveText('Sign up to take part');
  }
  async signUpToTakePart(): Promise<void> {
    await this.click(this.confirmationSignUpToTakePartBtn);
  }
}
