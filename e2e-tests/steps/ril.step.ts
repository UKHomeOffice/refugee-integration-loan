import { createBdd } from 'playwright-bdd';
import { test } from '../fixture/fixtures';
import { ConstantsLib as c } from '../utility-helper/constants-lib';

export const { Given, When, Then } = createBdd(test);

Given('I visit ril application Your address applied for an Integration Loan Before page', async ({ pages }) => {
  await pages.rilHomePage.navigateToUrl();
});

When('I select {string} and click continue button from Your address applied for an Integration Loan Before page', async ({ pages }, option: string) => {
  if (option === c.YES || option === c.NO) {
    await pages.rilHomePage.completeHomePage(option);
  } else {
    throw new Error(`Unsupported option "${option}"`);
  }
});

Then('the user should be on RIL {string} page', async ({ pages }, title: string) => {
  await pages.basePage.assertPageTitle(pages.basePage.page, title);
});

When('I select {string} and click continue button from Loan Granted page', async ({ pages }, option: string) => {
  if (option === c.YES || option === c.NO) {
    await pages.rilLoanGrantedPage.completeLoanGrantedPage(option);
  } else {
    throw new Error(`Unsupported option "${option}"`);
  }
});

When('I select {string} and click continue button from Do you have a partner with you in the UK page', async ({ pages }, option: string) => {
  if (option === c.YES || option === c.NO) {
    await pages.rilPartnerWithYouInTheUKPage.completePartnerWithYouInTheUKPage(option);
  } else {
    throw new Error(`Unsupported option "${option}"`);
  }
});

When('I select {string} and click continue button from Who received the integration loan page', async ({ pages }, option: string) => {
  if (option === c.OTHER_LOAN_RECIPIENT || option === c.APPLICANT_LOAN_RECIPIENT || option === c.PARTNER_LOAN_RECIPIENT) {
    await pages.rilWhoReceivedIntegrationLoanPage.selectWhoReceivedTheIntegrationLoanPage(option);
  } else {
    throw new Error(`Unsupported option "${option}"`);
  }
});

When('the user validates the {string} page', async ({ pages }, title: string) => {
  await pages.basePage.assertPageTitle(pages.basePage.page, title);
  await pages.rilYouCannotApplyForLoanPage.validateYouCannotApplyForLoanPageContent();
});

When('I complete address details and continue from Address details page', async ({ pages }) => {
  await pages.rilYourAddressInTheUKPage.enterAddressDetails(c.ADDRESS_TEXT, c.ADDRESS_TEXT, c.ADDRESS_TEXT, c.POSTCODE);
});

When('I complete bank or building society account details and continue from bank or building society account details page', async ({ pages }) => {
  await pages.rilBankOrBuildingSocietyAccountPage.enterBankOrBuildingSocietyDetails(c.BUILDING_SOCIETY_NAME, c.RIL_AMOUNT, c.SORT_CODE, c.ACCOUNT_NUMBER, c.LOAN_AMOUNT);
});

When('I verify Check your answers before sending your application page and continue from there', async ({ pages }) => {
  await pages.rilCheckYourAnswersPage.completeCheckYourAnswersPage();
});

When('I complete the joint main applicant section and continue', async ({ pages }) => {
  await pages.rilPartnerWithYouInTheUKPage.completePartnerWithYouInTheUKPage(c.YES);
  await pages.rilApplyingLoanTogetherWithYourPartnerPage.completeApplyingLoanTogetherWithYourPartnerPage(c.YES);
  await pages.rilBiometricResidencePermitDetailsPage.enterBRPDetails(c.BRP_NUMBER, c.FULL_NAME, c.DATE_OF_BIRTH);
  await pages.rilNationalInsuranceNumberPage.completeNationalInsuranceNumberPage(c.NATIONAL_INSURANCE_NUMBER);
  await pages.rilKnownByOtherNamesPage.completeKnownByOtherNamesPage(c.YES);
  await pages.rilFullNamePage.completeFullNamePage(c.FULL_NAME);
  await pages.rilOtherNamesPage.completeOtherNamesPage(c.FULL_NAME);
  await pages.rilHomeOfficeReferenceNumberPage.completeHomeOfficeReferenceNumberPage(c.JOINT_HOME_OFFICE_REFERENCE);
});

When('I complete the joint dependents section and continue', async ({ pages }) => {
  await pages.rilPartnerBRPDetailsPage.enterPartnerBRPDetails(c.BRP_NUMBER, c.DEPENDANT_FULL_NAME, c.DATE_OF_BIRTH);
  await pages.rilPartnerNINumberPage.enterPartnerNINumber(c.NATIONAL_INSURANCE_NUMBER);
  await pages.rilPartnerKnownByOtherNamesPage.completePartnerKnownByOtherNamesPage(c.YES);
  await pages.rilPartnerFullNamePage.completePartnerFullNamePage(c.DEPENDANT_FULL_NAME);
  await pages.rilPartnerOtherNamesPage.completePartnerOtherNamesPage();
  await pages.rilPartnerConvictedOfACrimeInTheUKPage.completePartnerConvictedOfACrimePage(c.NO);
  await pages.rilDependantsLivingWithYouPage.completeDependantsLivingWithYouPage(c.YES);
  await pages.rilEnterDetailsOfYourDependantPage.enterDetailsOfTheDependants(c.DEPENDANT_FULL_NAME, c.DATE_OF_BIRTH, c.DEPENDANT_RELATIONSHIP);
  await pages.basePage.clickContinueButton();
});

When('I complete the combined loan application details of applicants and continue', async ({ pages }) => {
  await pages.rilCombineMoneyReceiveEachMonthPage.enterCombinedMoneyReceiveEachMonthDetails(c.ALL_INCOME_OPTIONS);
  await pages.rilCombinedMoneySpentEachMonthPage.enterCombinedMoneySpentEachMonthDetails(c.ALL_EXPENDITURE_OPTIONS);
  await pages.rilCombinedSavingsPage.completeCombinedSavingsPage(c.YES, c.SAVINGS_AMOUNT);
  await pages.rilCombinedLoanAmountPage.completeCombinedLoanAmountPage(c.LOAN_AMOUNT);
  await pages.rilCombinedWhatWillYouUseTheLoanForPage.completeCombinedWhatWillYouUseTheLoanForPage(Object.values(c.LOAN_PURPOSE_LABELS));
});

When('I complete the single main applicant section and continue', async ({ pages }) => {
  await pages.rilPartnerWithYouInTheUKPage.completePartnerWithYouInTheUKPage(c.NO);
  await pages.rilBiometricResidencePermitDetailsPage.enterBRPDetails(c.BRP_NUMBER, c.FULL_NAME, c.DATE_OF_BIRTH);
  await pages.rilNationalInsuranceNumberPage.completeNationalInsuranceNumberPage(c.NATIONAL_INSURANCE_NUMBER);
  await pages.rilKnownByOtherNamesPage.completeKnownByOtherNamesPage(c.YES);
  await pages.rilFullNamePage.completeFullNamePage(c.FULL_NAME);
  await pages.rilOtherNamesPage.completeOtherNamesPage(c.FULL_NAME);
  await pages.rilHomeOfficeReferenceNumberPage.completeHomeOfficeReferenceNumberPage(c.SINGLE_HOME_OFFICE_REFERENCE);
  await pages.rilConvictedOfACrimeInTheUKPage.completeConvictedOfACrimePage(c.NO, c.NOT_APPLICABLE);
});

When('I complete the single dependents section and continue', async ({ pages }) => {
  await pages.rilDependantsLivingWithYouPage.completeDependantsLivingWithYouPage(c.NO);
});

When('I complete the loan details of an applicant and continue', async ({ pages }) => {
  await pages.rilMoneyDoYouReceiveEachMonthPage.completeMoneyDoYouReceiveEachMonthPage(c.ALL_INCOME_OPTIONS);
  await pages.rilMoneyDoYouSpentEachMonthPage.completeMoneyDoYouSpentEachMonthPage(c.ALL_EXPENDITURE_OPTIONS);
  await pages.rilDoYouHaveAnySavingsPage.completeSavingsPage(c.YES, c.SAVINGS_AMOUNT);
  await pages.rilLoanAmountPage.completeLoanAmountPage(c.LOAN_AMOUNT);
  await pages.rilWhatWillYouUseTheLoanForPage.completeWhatWillYouUseTheLoanForPage(Object.values(c.LOAN_PURPOSE_LABELS));
});

When('I complete contact and help details and continue', async ({ pages }) => {
  await pages.rilHowWouldYouLikeUsToContactYouPage.completeHowWouldYouLikeUsToContactYouPage(c.SAS_HOF_EMAIL, c.TELEPHONE);
  await pages.rilYouGetAnyHelpMakingThisApplicationPage.completeYouGetAnyHelpMakingThisApplicationPage(c.YES);
  await pages.rilWhyDidYouNeedHelpPage.selectWhyDidYouNeedHelpPageOptions(c.HELP_REASONS);
  await pages.rilThePersonWhoHelpedYouPage.completePersonWhoHelpedYouPage(c.HELPER_FULL_NAME, c.HELPER_RELATIONSHIP, c.SAS_HOF_EMAIL, c.TELEPHONE);
});

// ********************************************************* Validation Steps ********************************************************* 
When("I validate address details and continue", async ({ pages }) => {
  await pages.rilYourAddressInTheUKPage.validateYourAddressPageContent();
  await pages.rilYourAddressInTheUKPage.enterAddressDetails(c.ADDRESS_TEXT, c.ADDRESS_TEXT, c.ADDRESS_TEXT, c.POSTCODE);
});

When("I validate contact and help details and continue", async ({ pages }) => {
  await pages.rilHowWouldYouLikeUsToContactYouPage.validateHowWouldYouLikeUsToContactYouPageContent();
  await pages.rilHowWouldYouLikeUsToContactYouPage.completeHowWouldYouLikeUsToContactYouPage(c.SAS_HOF_EMAIL, c.TELEPHONE);
  await pages.rilYouGetAnyHelpMakingThisApplicationPage.validateYouGetAnyHelpMakingThisApplicationPageContent();
  await pages.rilYouGetAnyHelpMakingThisApplicationPage.completeYouGetAnyHelpMakingThisApplicationPage(c.YES);
  await pages.rilWhyDidYouNeedHelpPage.validateWhyDidYouNeedHelpPageContent();
  await pages.rilWhyDidYouNeedHelpPage.selectWhyDidYouNeedHelpPageOptions(c.HELP_REASONS);
  await pages.rilThePersonWhoHelpedYouPage.validatePersonWhoHelpedYouPageContent();
  await pages.rilThePersonWhoHelpedYouPage.completePersonWhoHelpedYouPage(c.HELPER_FULL_NAME, c.HELPER_RELATIONSHIP, c.SAS_HOF_EMAIL, c.TELEPHONE);
});

When("I validate the content on Your address applied for an Integration Loan Before page", async ({ pages }) => {
  await pages.rilHomePage.validateHomePageContent();
  await pages.rilHomePage.completeHomePage(c.YES);
});

When("I validate the content on Loan Granted page", async ({ pages }) => {
  await pages.rilLoanGrantedPage.validateLoanGrantedPageContent();
  await pages.rilLoanGrantedPage.completeLoanGrantedPage(c.YES);
});

When("I validate the content on Who received the integration loan page", async ({ pages }) => {
  await pages.rilWhoReceivedIntegrationLoanPage.validateWhoReceivedIntegrationLoanPageContent();
  await pages.rilWhoReceivedIntegrationLoanPage.selectWhoReceivedTheIntegrationLoanPage(c.RECIPIENT_LABELS.ME_LABEL);
  await pages.rilYouCannotApplyForLoanPage.validateYouCannotApplyForLoanPageContent();
  await pages.rilYouCannotApplyForLoanPage.returnToPreviousLoanPage();
  await pages.rilWhoReceivedIntegrationLoanPage.selectWhoReceivedTheIntegrationLoanPage(c.OTHER_LOAN_RECIPIENT);
});

When("I validate main applicant and dependant sections content and continue", async ({ pages }) => {
  await pages.rilPartnerWithYouInTheUKPage.validatePartnerWithYouInTheUKPageContent();
  await pages.rilPartnerWithYouInTheUKPage.completePartnerWithYouInTheUKPage(c.YES);
  await pages.rilApplyingLoanTogetherWithYourPartnerPage.validateApplyingLoanTogetherWithYourPartnerPageContent();
  await pages.rilApplyingLoanTogetherWithYourPartnerPage.completeApplyingLoanTogetherWithYourPartnerPage(c.YES);
  await pages.rilBiometricResidencePermitDetailsPage.validateBiometricResidencePermitDetailsContent();
  await pages.rilBiometricResidencePermitDetailsPage.enterBRPDetails(c.BRP_NUMBER, c.FULL_NAME, c.DATE_OF_BIRTH);
  await pages.rilNationalInsuranceNumberPage.validateNationalInsuranceNumberPageContent();
  await pages.rilNationalInsuranceNumberPage.completeNationalInsuranceNumberPage(c.NATIONAL_INSURANCE_NUMBER);
  await pages.rilKnownByOtherNamesPage.validateKnownByOtherNamesPageContent();
  await pages.rilKnownByOtherNamesPage.completeKnownByOtherNamesPage(c.YES);
  await pages.rilFullNamePage.validateFullNamePageContent();
  await pages.rilFullNamePage.completeFullNamePage(c.FULL_NAME);
  await pages.rilOtherNamesPage.validateOtherNamesPageContent();
  await pages.rilOtherNamesPage.completeOtherNamesPage(c.FULL_NAME);
  await pages.rilHomeOfficeReferenceNumberPage.validateHomeOfficeReferenceNumberPageContent();
  await pages.rilHomeOfficeReferenceNumberPage.completeHomeOfficeReferenceNumberPage(c.JOINT_HOME_OFFICE_REFERENCE);
  await pages.rilPartnerBRPDetailsPage.validatePartnerBRPDetailsContent();
  await pages.rilPartnerBRPDetailsPage.enterPartnerBRPDetails(c.BRP_NUMBER, c.PARTNER_FULL_NAME, c.DATE_OF_BIRTH);
  await pages.rilPartnerNINumberPage.validatePartnerNINumberPageContent();
  await pages.rilPartnerNINumberPage.enterPartnerNINumber(c.PARTNER_NI_NUMBER);
  await pages.rilPartnerKnownByOtherNamesPage.validatePartnerKnownByOtherNamesPageContent();
  await pages.rilPartnerKnownByOtherNamesPage.completePartnerKnownByOtherNamesPage(c.YES);
  await pages.rilPartnerFullNamePage.validatePartnerFullNamePageContent();
  await pages.rilPartnerFullNamePage.completePartnerFullNamePage(c.PARTNER_OTHER_NAME);
  await pages.rilPartnerOtherNamesPage.validatePartnerOtherNamesPageContent();
  await pages.rilPartnerOtherNamesPage.completePartnerOtherNamesPage();
  await pages.rilPartnerConvictedOfACrimeInTheUKPage.validatePartnerConvictedOfACrimePageContent();
  await pages.rilPartnerConvictedOfACrimeInTheUKPage.completePartnerConvictedOfACrimePage(c.NO);
  await pages.rilDependantsLivingWithYouPage.validateDependantsLivingWithYouPageContent();
  await pages.rilDependantsLivingWithYouPage.completeDependantsLivingWithYouPage(c.YES);
  await pages.rilEnterDetailsOfYourDependantPage.validateDetailsOfYourDependantPageContent();
  await pages.rilEnterDetailsOfYourDependantPage.enterDetailsOfTheDependants(c.DEPENDANT_FULL_NAME, c.DATE_OF_BIRTH, c.DEPENDANT_RELATIONSHIP);
  await pages.basePage.clickContinueButton();
});

When("I validate the loan details of an applicants and continue", async ({ pages }) => {
  await pages.rilCombineMoneyReceiveEachMonthPage.validateCombinedMoneyReceiveEachMonthPageContent();
  await pages.rilCombineMoneyReceiveEachMonthPage.enterCombinedMoneyReceiveEachMonthDetails(c.VALIDATION_INCOME_OPTIONS);
  await pages.rilCombinedMoneySpentEachMonthPage.validateCombinedMoneySpentEachMonthPageContent();
  await pages.rilCombinedMoneySpentEachMonthPage.enterCombinedMoneySpentEachMonthDetails(c.VALIDATION_EXPENDITURE_OPTIONS);
  await pages.rilCombinedSavingsPage.validateCombinedHaveAnySavingsPageContent();
  await pages.rilCombinedSavingsPage.completeCombinedSavingsPage(c.YES, c.SAVINGS_AMOUNT);
  await pages.rilCombinedLoanAmountPage.validateLoanAmountPageContent();
  await pages.rilCombinedLoanAmountPage.completeCombinedLoanAmountPage(c.LOAN_AMOUNT);
  await pages.rilCombinedWhatWillYouUseTheLoanForPage.validateCombinedWhatWillYouUseTheLoanForPageContent();
  await pages.rilCombinedWhatWillYouUseTheLoanForPage.completeCombinedWhatWillYouUseTheLoanForPage(Object.values(c.LOAN_PURPOSE_LABELS));
});

When("I validate bank or building society account details and continue", async ({ pages }) => {
  await pages.rilBankOrBuildingSocietyAccountPage.validateBankOrBuildingSocietyPageContent();
  await pages.rilBankOrBuildingSocietyAccountPage.enterBankOrBuildingSocietyDetails(c.BUILDING_SOCIETY_NAME, c.RIL_AMOUNT, c.SORT_CODE, c.ACCOUNT_NUMBER, c.LOAN_AMOUNT);
});

When("I validate Your address applied for an Integration Loan Before selection page error messages and continue", async ({ pages }) => {
  await pages.rilHomePage.validateHomePageErrors();
  await pages.rilHomePage.completeHomePage(c.YES);
});

When("I validate Loan Granted selection page error messages and continue", async ({ pages }) => {
  await pages.rilLoanGrantedPage.validateLoanGrantedPageError();
  await pages.rilLoanGrantedPage.completeLoanGrantedPage(c.YES);
});

When("I validate Who received the integration loan page and continue", async ({ pages }) => {
  await pages.rilWhoReceivedIntegrationLoanPage.validateWhoReceivedIntegrationLoanPageError();
  await pages.rilWhoReceivedIntegrationLoanPage.selectWhoReceivedTheIntegrationLoanPage(c.OTHER_LOAN_RECIPIENT);
});

When("I validate main applicant and dependant sections errors and continue", async ({ pages }) => {
  await pages.rilPartnerWithYouInTheUKPage.validatePartnerWithYouInTheUKPageErrors();
  await pages.rilPartnerWithYouInTheUKPage.completePartnerWithYouInTheUKPage(c.YES);
  await pages.rilApplyingLoanTogetherWithYourPartnerPage.validateApplyingLoanTogetherWithYourPartnerPageErrors();
  await pages.rilApplyingLoanTogetherWithYourPartnerPage.completeApplyingLoanTogetherWithYourPartnerPage(c.YES);
  await pages.rilBiometricResidencePermitDetailsPage.validateBiometricResidencePermitDetailsErrors();
  await pages.rilBiometricResidencePermitDetailsPage.enterBRPDetails(c.BRP_NUMBER, c.FULL_NAME, c.DATE_OF_BIRTH);
  await pages.rilNationalInsuranceNumberPage.validateNationalInsuranceNumberPageErrors();
  await pages.rilNationalInsuranceNumberPage.completeNationalInsuranceNumberPage(c.NATIONAL_INSURANCE_NUMBER);
  await pages.rilKnownByOtherNamesPage.validateKnownByOtherNamesPageErrors();
  await pages.rilKnownByOtherNamesPage.completeKnownByOtherNamesPage(c.YES);
  await pages.rilFullNamePage.validateFullNamePageErrors();
  await pages.rilFullNamePage.completeFullNamePage(c.FULL_NAME);
  await pages.rilOtherNamesPage.completeOtherNamesPage(c.FULL_NAME);
  await pages.rilHomeOfficeReferenceNumberPage.validateHomeOfficeReferenceNumberPageErrors();
  await pages.rilHomeOfficeReferenceNumberPage.completeHomeOfficeReferenceNumberPage(c.JOINT_HOME_OFFICE_REFERENCE);
  await pages.rilPartnerBRPDetailsPage.validatePartnerBRPDetailsErrors();
  await pages.rilPartnerBRPDetailsPage.enterPartnerBRPDetails(c.BRP_NUMBER, c.PARTNER_FULL_NAME, c.DATE_OF_BIRTH);
  await pages.rilPartnerNINumberPage.validatePartnerNINumberPageErrors();
  await pages.rilPartnerNINumberPage.enterPartnerNINumber(c.PARTNER_NI_NUMBER);
  await pages.rilPartnerKnownByOtherNamesPage.validatePartnerKnownByOtherNamesPageErrors();
  await pages.rilPartnerKnownByOtherNamesPage.completePartnerKnownByOtherNamesPage(c.YES);
  await pages.rilPartnerFullNamePage.validatePartnerFullNamePageErrors();
  await pages.rilPartnerFullNamePage.completePartnerFullNamePage(c.PARTNER_OTHER_NAME);
  await pages.rilPartnerOtherNamesPage.completePartnerOtherNamesPage();
  await pages.rilPartnerConvictedOfACrimeInTheUKPage.validatePartnerConvictedOfACrimePageErrors();
  await pages.rilDependantsLivingWithYouPage.validateDependantsLivingWithYouPageErrors();
  await pages.rilDependantsLivingWithYouPage.completeDependantsLivingWithYouPage(c.YES);
  await pages.rilEnterDetailsOfYourDependantPage.validateDetailsOfYourDependantPageErrors();
  await pages.rilEnterDetailsOfYourDependantPage.enterDetailsOfTheDependants(c.DEPENDANT_FULL_NAME, c.DATE_OF_BIRTH, c.DEPENDANT_RELATIONSHIP);
  await pages.basePage.clickContinueButton();
});

When("I validate address details errors and continue", async ({ pages }) => {
  await pages.rilYourAddressInTheUKPage.validateYourAddressPageErrors();
  await pages.rilYourAddressInTheUKPage.enterAddressDetails(c.ADDRESS_TEXT, c.ADDRESS_TEXT, c.ADDRESS_TEXT, c.POSTCODE);
});

When("I validate the loan details of an applicants errors and continue", async ({ pages }) => {
  await pages.rilCombineMoneyReceiveEachMonthPage.validateCombinedMoneyReceiveEachMonthPageErrors();
  await pages.rilCombineMoneyReceiveEachMonthPage.enterCombinedMoneyReceiveEachMonthDetails(c.VALIDATION_INCOME_OPTIONS);
  await pages.rilCombinedMoneySpentEachMonthPage.validateCombinedMoneySpentEachMonthPageErrors();
  await pages.rilCombinedMoneySpentEachMonthPage.enterCombinedMoneySpentEachMonthDetails(c.VALIDATION_EXPENDITURE_OPTIONS);
  await pages.rilCombinedSavingsPage.validateCombinedHaveAnySavingsPageErrors();
  await pages.rilCombinedSavingsPage.completeCombinedSavingsPage(c.YES, c.SAVINGS_AMOUNT);
  await pages.rilCombinedLoanAmountPage.validateLoanAmountPageErrors();
  await pages.rilCombinedLoanAmountPage.completeCombinedLoanAmountPage(c.LOAN_AMOUNT);
  await pages.rilCombinedWhatWillYouUseTheLoanForPage.validateCombinedWhatWillYouUseTheLoanForPageErrors();
  await pages.rilCombinedWhatWillYouUseTheLoanForPage.completeCombinedWhatWillYouUseTheLoanForPage(Object.values(c.LOAN_PURPOSE_LABELS));
});

When("I validate bank or building society account details errors and continue", async ({ pages }) => {
  await pages.rilBankOrBuildingSocietyAccountPage.validateBankOrBuildingSocietyPageErrors();
  await pages.rilBankOrBuildingSocietyAccountPage.enterBankOrBuildingSocietyDetails(c.BUILDING_SOCIETY_NAME, c.RIL_AMOUNT, c.SORT_CODE, c.ACCOUNT_NUMBER, c.LOAN_AMOUNT);
});

When("I validate contact and help details selection errors and continue", async ({ pages }) => {
  await pages.rilHowWouldYouLikeUsToContactYouPage.validateHowWouldYouLikeUsToContactYouPageErrors();
  await pages.rilHowWouldYouLikeUsToContactYouPage.completeHowWouldYouLikeUsToContactYouPage(c.SAS_HOF_EMAIL, c.TELEPHONE);
  await pages.rilYouGetAnyHelpMakingThisApplicationPage.validateYouGetAnyHelpMakingThisApplicationPageErrors();
  await pages.rilYouGetAnyHelpMakingThisApplicationPage.completeYouGetAnyHelpMakingThisApplicationPage(c.YES);
  await pages.rilWhyDidYouNeedHelpPage.validateWhyDidYouNeedHelpPageErrors();
  await pages.rilWhyDidYouNeedHelpPage.selectWhyDidYouNeedHelpPageOptions(c.HELP_REASONS);
  await pages.rilThePersonWhoHelpedYouPage.validatePersonWhoHelpedYouPageErrors();
  await pages.rilThePersonWhoHelpedYouPage.completePersonWhoHelpedYouPage(c.HELPER_FULL_NAME, c.HELPER_RELATIONSHIP, c.SAS_HOF_EMAIL, c.TELEPHONE);
});

When("I validate the content on the Check your answers before sending your application page and continue", async ({ pages }) => {
  await pages.rilCheckYourAnswersPage.validateCheckYourAnswersPageContent();
  await pages.rilCheckYourAnswersPage.completeCheckYourAnswersPage();
});

When("I validate the Application sent page", async ({ pages }) => {
  await pages.rilApplicationSentPage.validateApplicationSentPageContent();
  await pages.rilApplicationSentPage.signUpToTakePart();
});