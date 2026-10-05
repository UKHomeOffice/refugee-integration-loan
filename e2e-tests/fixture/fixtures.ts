import { test as base } from 'playwright-bdd';
import { basePage } from '../pages/base-page';
import { RilApplyingLoanTogetherWithYourPartnerPage } from '../pages/ril-applying-loan-together-with-your-partner.page';
import { RilCombinedLoanAmountPage } from '../pages/ril-combined-loan-amount.page';
import { RilCombinedMoneySpentEachMonthPage } from '../pages/ril-combined-money-spent-each-month.page';
import { RilCombinedSavingsPage } from '../pages/ril-combined-savings.page';
import { RilCombinedWhatWillYouUseTheLoanForPage } from '../pages/ril-combined-what-will-you-use-the-loan-for.page';
import { RilCombineMoneyReceiveEachMonthPage } from '../pages/ril-combine-money-receive-each-month.page';
import { RilEnterDetailsOfYourDependantPage } from '../pages/ril-enter-details-of-your-dependant.page';
import { RilPartnerBRPDetailsPage } from '../pages/ril-partner-brp-details.page';
import { RilPartnerConvictedOfACrimeInTheUKPage } from '../pages/ril-partner-convicted-of-a-crime-in-the-uk.page';
import { RilPartnerFullNamePage } from '../pages/ril-partner-full-name.page';
import { RilPartnerKnownByOtherNamesPage } from '../pages/ril-partner-known-by-other-names.page';
import { RilPartnerNINumberPage } from '../pages/ril-partner-ni-number.page';
import { RilPartnerOtherNamesPage } from '../pages/ril-partner-other-names.page';
import { RilApplicationSentPage } from '../pages/ril-application-sent.page';
import { RilBankOrBuildingSocietyAccountPage } from '../pages/ril-bank-or-building-society-account.page';
import { RilBiometricResidencePermitDetailsPage } from '../pages/ril-biometric-residence-permit-details.page';
import { RilCheckYourAnswersPage } from '../pages/ril-check-your-answers.page';
import { RilConvictedOfACrimeInTheUKPage } from '../pages/ril-convicted-of-a-crime-in-the-uk.page';
import { RilDependantsLivingWithYouPage } from '../pages/ril-dependants-living-with-you.page';
import { RilDoYouHaveAnySavingsPage } from '../pages/ril-do-you-have-any-savings.page';
import { RilFullNamePage } from '../pages/ril-full-name.page';
import { RilHomeOfficeReferenceNumberPage } from '../pages/ril-home-office-reference-number.page';
import { RilHomePage } from '../pages/ril-home.page';
import { RilHowWouldYouLikeUsToContactYouPage } from '../pages/ril-how-would-you-like-us-to-contact-you.page';
import { RilKnownByOtherNamesPage } from '../pages/ril-known-by-other-names.page';
import { RilLoanAmountPage } from '../pages/ril-loan-amount.page';
import { RilLoanGrantedPage } from '../pages/ril-loan-granted.page';
import { RilMoneyDoYouReceiveEachMonthPage } from '../pages/ril-money-do-you-receive-each-month.page';
import { RilMoneyDoYouSpentEachMonthPage } from '../pages/ril-money-do-you-spent-each-month.page';
import { RilNationalInsuranceNumberPage } from '../pages/ril-national-insurance-number.page';
import { RilOtherNamesPage } from '../pages/ril-other-names.page';
import { RilPartnerWithYouInTheUKPage } from '../pages/ril-partner-with-you-in-the-uk.page';
import { RilWhatAreTheDetailsOfThePersonWhoHelpedYouPage } from '../pages/ril-what-are-the-details-of-the-person-who-helped-you.page';
import { RilWhatWillYouUseTheLoanForPage } from '../pages/ril-what-will-you-use-the-loan-for.page';
import { RilWhoReceivedIntegrationLoanPage } from '../pages/ril-who-received-integration-loan.page';
import { RilWhyDidYouNeedHelpPage } from '../pages/ril-why-did-you-need-help.page';
import { RilYouCannotApplyForLoanPage } from '../pages/ril-you-cannot-apply-for-loan.page';
import { RilYouGetAnyHelpMakingThisApplicationPage } from '../pages/ril-you-get-any-help-making-this-application.page';
import { RilYourAddressInTheUKPage } from '../pages/ril-your-address-in-the-uk.page';

export type Pages = {
  basePage: basePage;
  rilApplyingLoanTogetherWithYourPartnerPage: RilApplyingLoanTogetherWithYourPartnerPage;
  rilCombinedLoanAmountPage: RilCombinedLoanAmountPage;
  rilCombinedMoneySpentEachMonthPage: RilCombinedMoneySpentEachMonthPage;
  rilCombinedSavingsPage: RilCombinedSavingsPage;
  rilCombinedWhatWillYouUseTheLoanForPage: RilCombinedWhatWillYouUseTheLoanForPage;
  rilCombineMoneyReceiveEachMonthPage: RilCombineMoneyReceiveEachMonthPage;
  rilEnterDetailsOfYourDependantPage: RilEnterDetailsOfYourDependantPage;
  rilPartnerBRPDetailsPage: RilPartnerBRPDetailsPage;
  rilPartnerConvictedOfACrimeInTheUKPage: RilPartnerConvictedOfACrimeInTheUKPage;
  rilPartnerFullNamePage: RilPartnerFullNamePage;
  rilPartnerKnownByOtherNamesPage: RilPartnerKnownByOtherNamesPage;
  rilPartnerNINumberPage: RilPartnerNINumberPage;
  rilPartnerOtherNamesPage: RilPartnerOtherNamesPage;
  rilApplicationSentPage: RilApplicationSentPage;
  rilBankOrBuildingSocietyAccountPage: RilBankOrBuildingSocietyAccountPage;
  rilBiometricResidencePermitDetailsPage: RilBiometricResidencePermitDetailsPage;
  rilCheckYourAnswersPage: RilCheckYourAnswersPage;
  rilConvictedOfACrimeInTheUKPage: RilConvictedOfACrimeInTheUKPage;
  rilDependantsLivingWithYouPage: RilDependantsLivingWithYouPage;
  rilDoYouHaveAnySavingsPage: RilDoYouHaveAnySavingsPage;
  rilFullNamePage: RilFullNamePage;
  rilHomeOfficeReferenceNumberPage: RilHomeOfficeReferenceNumberPage;
  rilHomePage: RilHomePage;
  rilHowWouldYouLikeUsToContactYouPage: RilHowWouldYouLikeUsToContactYouPage;
  rilKnownByOtherNamesPage: RilKnownByOtherNamesPage;
  rilLoanAmountPage: RilLoanAmountPage;
  rilLoanGrantedPage: RilLoanGrantedPage;
  rilMoneyDoYouReceiveEachMonthPage: RilMoneyDoYouReceiveEachMonthPage;
  rilMoneyDoYouSpentEachMonthPage: RilMoneyDoYouSpentEachMonthPage;
  rilNationalInsuranceNumberPage: RilNationalInsuranceNumberPage;
  rilOtherNamesPage: RilOtherNamesPage;
  rilPartnerWithYouInTheUKPage: RilPartnerWithYouInTheUKPage;
  rilWhatAreTheDetailsOfThePersonWhoHelpedYouPage: RilWhatAreTheDetailsOfThePersonWhoHelpedYouPage;
  rilWhatWillYouUseTheLoanForPage: RilWhatWillYouUseTheLoanForPage;
  rilWhoReceivedIntegrationLoanPage: RilWhoReceivedIntegrationLoanPage;
  rilWhyDidYouNeedHelpPage: RilWhyDidYouNeedHelpPage;
  rilYouCannotApplyForLoanPage: RilYouCannotApplyForLoanPage;
  rilYouGetAnyHelpMakingThisApplicationPage: RilYouGetAnyHelpMakingThisApplicationPage;
  rilYourAddressInTheUKPage: RilYourAddressInTheUKPage;
  rilThePersonWhoHelpedYouPage: RilWhatAreTheDetailsOfThePersonWhoHelpedYouPage;
};

export const test = base.extend<{ pages: Pages }>({
  pages: async ({ page }, use) => {
    await use({
      basePage: new basePage(page),
      rilApplyingLoanTogetherWithYourPartnerPage: new RilApplyingLoanTogetherWithYourPartnerPage(page),
      rilCombinedLoanAmountPage: new RilCombinedLoanAmountPage(page),
      rilCombinedMoneySpentEachMonthPage: new RilCombinedMoneySpentEachMonthPage(page),
      rilCombinedSavingsPage: new RilCombinedSavingsPage(page),
      rilCombinedWhatWillYouUseTheLoanForPage: new RilCombinedWhatWillYouUseTheLoanForPage(page),
      rilCombineMoneyReceiveEachMonthPage: new RilCombineMoneyReceiveEachMonthPage(page),
      rilEnterDetailsOfYourDependantPage: new RilEnterDetailsOfYourDependantPage(page),
      rilPartnerBRPDetailsPage: new RilPartnerBRPDetailsPage(page),
      rilPartnerConvictedOfACrimeInTheUKPage: new RilPartnerConvictedOfACrimeInTheUKPage(page),
      rilPartnerFullNamePage: new RilPartnerFullNamePage(page),
      rilPartnerKnownByOtherNamesPage: new RilPartnerKnownByOtherNamesPage(page),
      rilPartnerNINumberPage: new RilPartnerNINumberPage(page),
      rilPartnerOtherNamesPage: new RilPartnerOtherNamesPage(page),
      rilApplicationSentPage: new RilApplicationSentPage(page),
      rilBankOrBuildingSocietyAccountPage: new RilBankOrBuildingSocietyAccountPage(page),
      rilBiometricResidencePermitDetailsPage: new RilBiometricResidencePermitDetailsPage(page),
      rilCheckYourAnswersPage: new RilCheckYourAnswersPage(page),
      rilConvictedOfACrimeInTheUKPage: new RilConvictedOfACrimeInTheUKPage(page),
      rilDependantsLivingWithYouPage: new RilDependantsLivingWithYouPage(page),
      rilDoYouHaveAnySavingsPage: new RilDoYouHaveAnySavingsPage(page),
      rilFullNamePage: new RilFullNamePage(page),
      rilHomeOfficeReferenceNumberPage: new RilHomeOfficeReferenceNumberPage(page),
      rilHomePage: new RilHomePage(page),
      rilHowWouldYouLikeUsToContactYouPage: new RilHowWouldYouLikeUsToContactYouPage(page),
      rilKnownByOtherNamesPage: new RilKnownByOtherNamesPage(page),
      rilLoanAmountPage: new RilLoanAmountPage(page),
      rilLoanGrantedPage: new RilLoanGrantedPage(page),
      rilMoneyDoYouReceiveEachMonthPage: new RilMoneyDoYouReceiveEachMonthPage(page),
      rilMoneyDoYouSpentEachMonthPage: new RilMoneyDoYouSpentEachMonthPage(page),
      rilNationalInsuranceNumberPage: new RilNationalInsuranceNumberPage(page),
      rilOtherNamesPage: new RilOtherNamesPage(page),
      rilPartnerWithYouInTheUKPage: new RilPartnerWithYouInTheUKPage(page),
      rilWhatAreTheDetailsOfThePersonWhoHelpedYouPage: new RilWhatAreTheDetailsOfThePersonWhoHelpedYouPage(page),
      rilWhatWillYouUseTheLoanForPage: new RilWhatWillYouUseTheLoanForPage(page),
      rilWhoReceivedIntegrationLoanPage: new RilWhoReceivedIntegrationLoanPage(page),
      rilWhyDidYouNeedHelpPage: new RilWhyDidYouNeedHelpPage(page),
      rilYouCannotApplyForLoanPage: new RilYouCannotApplyForLoanPage(page),
      rilYouGetAnyHelpMakingThisApplicationPage: new RilYouGetAnyHelpMakingThisApplicationPage(page),
      rilYourAddressInTheUKPage: new RilYourAddressInTheUKPage(page),
      rilThePersonWhoHelpedYouPage: new RilWhatAreTheDetailsOfThePersonWhoHelpedYouPage(page),
    });
  },
});

export const expect = test.expect;
