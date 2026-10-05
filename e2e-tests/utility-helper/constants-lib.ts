import type { PageInputValues } from '../test-data/page-input-values';
import { basePage } from '../pages/base-page';
const inputValues: PageInputValues = {
  zeroAmount: '0',
  amount99: '99',
  currencySymbolAmount: '$99',
  threeDecimalAmount: '99.999',
  aboveMaximumLoanAmount: '999',
  rentAmount: '999.00',
  utilityBillsAmount: '49.00',
  foodAmount: '50.00',
  mobilePhoneAmount: '19.00',
  travelAmount: '29.00',
  clothingAmount: '89.00',
  universalCreditDeductionsAmount: '99.00',
  otherOutgoingAmount: '39.00',
  negativeSalaryAmount: '-99',
  negativeAmount: '-9',
  salaryWithLetter: '99o',
  amountWithLetter: '9o',
  rentWithThreeDecimals: '199.999',
  utilityBillsWithThreeDecimals: '19.999',
  foodWithThreeDecimals: '29.999',
  phoneWithThreeDecimals: '39.999',
  travelWithThreeDecimals: '49.999',
  clothingWithThreeDecimals: '59.999',
  deductionsWithThreeDecimals: '69.999',
  otherOutgoingsWithThreeDecimals: '79.999',
  randomText260: basePage.randomAlphabet(260),
  randomText10: basePage.randomAlphabet(10),
  randomText100: basePage.randomAlphabet(100),
  salaryAmount: '1999',
  randomText99: basePage.randomAlphabet(99),
  salaryWithThreeDecimals: '999.999',
  dependantFullName: 'Applicant Dependant',
  invalidDependantCalendarDate: '31/09/2006',
  dependantRelationship: 'Child',
  dependantDateWithLetter: '3o/09/2006',
  brpWithSpace: 'ZU 123456',
  invalidDataFullName: 'Test Test',
  invalidDayAndMonth: '32/19/2000',
  crimeDetails: 'The details of the crime',
  shortNiNumber: 'BC123456',
  niNumberWrongOrder: '123456ABC',
  longNiNumber: 'BC123456789A',
  bankValidationAccountName: 'Automation Test account',
  loanAmount: '280',
  shortSortCode: '0101',
  shortAccountNumber: '12345',
  longSortCode: '999999999999999999',
  longAccountNumber: '123456789',
  accountName: 'Test account',
  sortCodeWithSymbol: '$10101',
  accountNumberWithSymbol: '$123456789',
  sortCodeWithLetters: 'dsfdsfsdfs',
  accountNumberWithLetters: 'fsfs',
  shortBrpNumber: 'ZU123456',
  fullName: 'Automation Tester',
  invalidCalendarDate: '31/09/1999',
  emptyValue: '',
  invalidEmail: 'afas@.c',
  phoneWithLetters: 'rwrwrws',
  helperFullName: 'Automation1 Tester',
  helperRelationship: 'Friend',
  invalidHelperPhone: 'test',
  invalidPostcodeBuilding: 'a building',
  invalidPostcodeStreet: ' a street',
  invalidPostcodeCity: ' city',
  numericPostcode: '0123456',
  building: 'Test building',
  street: 'Test street',
  city: 'Test city',
  shortPostcode: 'CR92E',
};

export class ConstantsLib {
  static readonly YES = 'Yes';
  static readonly NO = 'No';
  static readonly SAVINGS_AMOUNT = inputValues.amount99;
  static readonly LOAN_AMOUNT = inputValues.loanAmount;
  static readonly SAS_HOF_EMAIL = requiredEnv('SAS_HOF_EMAIL');
  static readonly TELEPHONE = '01234567899';
  static readonly HELP_REASONS = 'Access to Internet-First Language-Questions Correctly-Complete the Application-Online Difficulty';
  static readonly HELPER_FULL_NAME = inputValues.helperFullName;
  static readonly HELPER_RELATIONSHIP = inputValues.helperRelationship;
  static readonly BRP_NUMBER = 'ZU1234567';
  static readonly PARTNER_FULL_NAME = 'Partner Automation Tester';
  static readonly DATE_OF_BIRTH = '31/03/1980';
  static readonly PARTNER_NI_NUMBER = 'AE 12 34 56 C';
  static readonly PARTNER_OTHER_NAME = 'Partner Full Name';
  static readonly APPLICANT_LOAN_RECIPIENT = 'Me';
  static readonly NOT_APPLICABLE = 'N/A';
  static readonly PARTNER_LOAN_RECIPIENT = 'My partner';
  static readonly OTHER_LOAN_RECIPIENT = 'Another person living at my address';
  static readonly NATIONAL_INSURANCE_NUMBER = 'AC 12 34 56 C';
  static readonly JOINT_HOME_OFFICE_REFERENCE = 'A1234567';
  static readonly DEPENDANT_FULL_NAME = 'Dependant Automation Tester';
  static readonly DEPENDANT_RELATIONSHIP = 'Spouse';
  static readonly ADDRESS_TEXT = 'Test';
  static readonly POSTCODE = 'CR92ER';
  static readonly ALL_INCOME_OPTIONS = 'Salary-Universal Credit-Child Benefit-Housing Benefit-Other';
  static readonly ALL_EXPENDITURE_OPTIONS = 'Rent-Utility bills-Food cleaning-Mobile phone-Travel-Clothing-Universal credit deductions-Other';
  static readonly SINGLE_HOME_OFFICE_REFERENCE = 'A1234568';
  static readonly VALIDATION_INCOME_OPTIONS = 'Salary-Universal Credit';
  static readonly VALIDATION_EXPENDITURE_OPTIONS = 'Rent-Utility bills-Food cleaning-Mobile phone';
  static readonly BUILDING_SOCIETY_NAME = inputValues.accountName;
  static readonly RIL_AMOUNT = '250';
  static readonly SORT_CODE = '010101';
  static readonly ACCOUNT_NUMBER = '12345678';

  static readonly LOAN_PURPOSE_LABELS = {
    HOUSING_LABEL: 'Housing',
    ESSENTIALS_ITEMS_LABEL: 'Essential items',
    LIVING_COSTS_LABEL: 'Basic living costs',
    TRAINING_EDUCATION_LABEL: 'Training or education',
    WORK_CLOTHING_LABEL: 'Work clothing and equipment',
  } as const;

  static readonly RECIPIENT_LABELS = {
    ME_LABEL: 'Me',
    MY_PARTNER_LABEL: 'My partner',
    PERSON_LIVING_LABEL: 'Another person living at my address',
  } as const;

  static readonly PAGE_INPUT_VALUES: PageInputValues = inputValues;
  static readonly FULL_NAME = inputValues.fullName;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}
