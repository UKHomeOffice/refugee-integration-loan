import { expect, Locator, Page } from '@playwright/test';
import { basePage } from './base-page';
export class RilCheckYourAnswersPage extends basePage {
  readonly checkYourAnswersHeaderText: Locator;
  readonly applicantDetailsSectionText: Locator;
  readonly knownByAnyOtherNamesSectionText: Locator;
  readonly otherNamesSectionText: Locator;
  readonly partnerDetailsSectionText: Locator;
  readonly partnerKnownOtherNamesSectionText: Locator;
  readonly partnerOtherNamesSectionText: Locator;
  readonly bankAccountDetailsSectionText: Locator;
  readonly criminalConvictionsSectionText: Locator;
  readonly incomeSectionText: Locator;
  readonly outgoingsSectionText: Locator;
  readonly savingsSectionText: Locator;
  readonly loanDetailsSectionText: Locator;
  readonly addressSectionText: Locator;
  readonly contactDetailsSectionText: Locator;
  readonly dependantsLivingWithYouSectionText: Locator;
  readonly yourDependantsSectionText: Locator;
  readonly helpWithApplicationSectionText: Locator;
  readonly otherDetailsSectionText: Locator;
  readonly nowSendYourApplicationHeaderText: Locator;
  readonly submittingThisApplicationText: Locator;
  readonly informationIsCorrectText: Locator;
  readonly loanForItsIntendedPurposeText: Locator;
  readonly privacyPolicyText: Locator;
  readonly submitMyApplicationBtn: Locator;
  constructor(page: Page) {
    super(page);
    this.checkYourAnswersHeaderText = page.locator('div#gov-grid-row-content>div>h1').first();
    this.applicantDetailsSectionText = page.locator('div#gov-grid-row-content>div>form>div:nth-of-type(1)>h2').first();
    this.knownByAnyOtherNamesSectionText = page.locator("form[method='POST']>div:nth-of-type(2)>h2").first();
    this.otherNamesSectionText = page.locator("form[method='POST']>div:nth-of-type(3)>h2").first();
    this.partnerDetailsSectionText = page.locator("form[method='POST']>div:nth-of-type(4)>h2").first();
    this.partnerKnownOtherNamesSectionText = page.locator("form[method='POST']>div:nth-of-type(5)>h2").first();
    this.partnerOtherNamesSectionText = page.locator("form[method='POST']>div:nth-of-type(6)>h2").first();
    this.bankAccountDetailsSectionText = page.locator("form[method='POST']>div:nth-of-type(7)>h2").first();
    this.criminalConvictionsSectionText = page.locator("form[method='POST']>div:nth-of-type(8)>h2").first();
    this.incomeSectionText = page.locator("form[method='POST']>div:nth-of-type(9)>h2").first();
    this.outgoingsSectionText = page.locator("form[method='POST']>div:nth-of-type(10)>h2").first();
    this.savingsSectionText = page.locator("form[method='POST']>div:nth-of-type(11)>h2").first();
    this.loanDetailsSectionText = page.locator("form[method='POST']>div:nth-of-type(12)>h2").first();
    this.addressSectionText = page.locator("form[method='POST']>div:nth-of-type(13)>h2").first();
    this.contactDetailsSectionText = page.locator("form[method='POST']>div:nth-of-type(14)>h2").first();
    this.dependantsLivingWithYouSectionText = page.locator("form[method='POST']>div:nth-of-type(15)>h2").first();
    this.yourDependantsSectionText = page.locator("form[method='POST']>div:nth-of-type(16)>h2").first();
    this.helpWithApplicationSectionText = page.locator("form[method='POST']>div:nth-of-type(17)>h2").first();
    this.otherDetailsSectionText = page.locator("form[method='POST']>div:nth-of-type(18)>h2").first();
    this.nowSendYourApplicationHeaderText = page.locator("form[method='POST']>h2:nth-of-type(1)").first();
    this.submittingThisApplicationText = page.locator("form[method='POST']>p:nth-of-type(1)").first();
    this.informationIsCorrectText = page.locator("form[method='POST']>ul>li:nth-of-type(1)").first();
    this.loanForItsIntendedPurposeText = page.locator("form[method='POST']>ul>li:nth-of-type(2)").first();
    this.privacyPolicyText = page.locator("form[method='POST']>ul>li:nth-of-type(3)").first();
    this.submitMyApplicationBtn = page.locator('div#gov-grid-row-content>div>form>input:nth-of-type(1)').first();
  }
  async expectedPageTitle(): Promise<string> {
    return (
      ((await this.page.title()).startsWith('Error') ? 'Error: ' : '') +
      'Check your answers before sending your application – Apply for a refugee integration loan – GOV.UK'
    );
  }
  async validateCheckYourAnswersPageContent(): Promise<void> {
    await expect(this.submitMyApplicationBtn).toBeVisible();
    await expect(this.checkYourAnswersHeaderText).toHaveText('Check your answers before sending your application');
    await expect(this.applicantDetailsSectionText).toHaveText('Applicant\u2019s details');
    await expect(this.knownByAnyOtherNamesSectionText).toHaveText('Have you been known by any other names?');
    await expect(this.otherNamesSectionText).toHaveText('Other names');
    await expect(this.partnerDetailsSectionText).toHaveText('Partner\u2019s details');
    await expect(this.partnerKnownOtherNamesSectionText).toHaveText('Has your partner been known by any other names?');
    await expect(this.partnerOtherNamesSectionText).toHaveText("Partner's other names");
    await expect(this.bankAccountDetailsSectionText).toHaveText('Bank account details');
    await expect(this.criminalConvictionsSectionText).toHaveText('Criminal convictions');
    await expect(this.incomeSectionText).toHaveText('Income');
    await expect(this.outgoingsSectionText).toHaveText('Outgoings');
    await expect(this.savingsSectionText).toHaveText('Savings');
    await expect(this.loanDetailsSectionText).toHaveText('Loan details');
    await expect(this.addressSectionText).toHaveText('Address');
    await expect(this.contactDetailsSectionText).toHaveText('Contact details');
    await expect(this.dependantsLivingWithYouSectionText).toHaveText('Do you have any dependants living with you?');
    await expect(this.yourDependantsSectionText).toHaveText('Your dependants');
    await expect(this.helpWithApplicationSectionText).toHaveText('Help with application');
    await expect(this.otherDetailsSectionText).toHaveText('Other details');
    await expect(this.nowSendYourApplicationHeaderText).toHaveText('Now send your application');
    await expect(this.submittingThisApplicationText).toHaveText('By submitting this application, you agree that:');
    await expect(this.informationIsCorrectText).toHaveText(
      'the information is correct and complete as far as you know',
    );
    await expect(this.loanForItsIntendedPurposeText).toHaveText('you will use the loan for its intended purpose');
    await expect(this.privacyPolicyText).toHaveText('you have read and understood the privacy policy');
  }
  async completeCheckYourAnswersPage(): Promise<void> {
    await this.assertPageTitle(this.page, await this.expectedPageTitle());
    await this.click(this.submitMyApplicationBtn);
  }
}
