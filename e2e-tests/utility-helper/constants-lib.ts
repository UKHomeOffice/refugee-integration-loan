import { basePage } from '../pages/base-page';

export class ConstantsLib {
  static readonly ZERO_AMOUNT: string = '0';
  static readonly AMOUNT_99: string = '99';
  static readonly CURRENCY_SYMBOL_AMOUNT: string = '$99';
  static readonly THREE_DECIMAL_AMOUNT: string = '99.999';
  static readonly ABOVE_MAXIMUM_LOAN_AMOUNT: string = '999';
  static readonly RENT_AMOUNT: string = '999.00';
  static readonly UTILITY_BILLS_AMOUNT: string = '49.00';
  static readonly FOOD_AMOUNT: string = '50.00';
  static readonly MOBILE_PHONE_AMOUNT: string = '19.00';
  static readonly TRAVEL_AMOUNT: string = '29.00';
  static readonly CLOTHING_AMOUNT: string = '89.00';
  static readonly UNIVERSAL_CREDIT_DEDUCTIONS_AMOUNT: string = '99.00';
  static readonly OTHER_OUTGOING_AMOUNT: string = '39.00';
  static readonly NEGATIVE_SALARY_AMOUNT: string = '-99';
  static readonly NEGATIVE_AMOUNT: string = '-9';
  static readonly SALARY_WITH_LETTER: string = '99o';
  static readonly AMOUNT_WITH_LETTER: string = '9o';
  static readonly RENT_WITH_THREE_DECIMALS: string = '199.999';
  static readonly UTILITY_BILLS_WITH_THREE_DECIMALS: string = '19.999';
  static readonly FOOD_WITH_THREE_DECIMALS: string = '29.999';
  static readonly PHONE_WITH_THREE_DECIMALS: string = '39.999';
  static readonly TRAVEL_WITH_THREE_DECIMALS: string = '49.999';
  static readonly CLOTHING_WITH_THREE_DECIMALS: string = '59.999';
  static readonly DEDUCTIONS_WITH_THREE_DECIMALS: string = '69.999';
  static readonly OTHER_OUTGOINGS_WITH_THREE_DECIMALS: string = '79.999';
  static readonly RANDOM_TEXT_260: string = basePage.randomAlphabet(260);
  static readonly RANDOM_TEXT_10: string = basePage.randomAlphabet(10);
  static readonly RANDOM_TEXT_100: string = basePage.randomAlphabet(100);
  static readonly SALARY_AMOUNT: string = '1999';
  static readonly RANDOM_TEXT_99: string = basePage.randomAlphabet(99);
  static readonly SALARY_WITH_THREE_DECIMALS: string = '999.999';
  static readonly DEPENDANT_INPUT_FULL_NAME: string = 'Applicant Dependant';
  static readonly INVALID_DEPENDANT_CALENDAR_DATE: string = '31/09/2006';
  static readonly DEPENDANT_INPUT_RELATIONSHIP: string = 'Child';
  static readonly DEPENDANT_DATE_WITH_LETTER: string = '3o/09/2006';
  static readonly BRP_WITH_SPACE: string = 'ZU 123456';
  static readonly INVALID_DATA_FULL_NAME: string = 'Test Test';
  static readonly INVALID_DAY_AND_MONTH: string = '32/19/2000';
  static readonly CRIME_DETAILS: string = 'The details of the crime';
  static readonly SHORT_NI_NUMBER: string = 'BC123456';
  static readonly NI_NUMBER_WRONG_ORDER: string = '123456ABC';
  static readonly LONG_NI_NUMBER: string = 'BC123456789A';
  static readonly BANK_VALIDATION_ACCOUNT_NAME: string = 'Automation Test account';
  static readonly INPUT_LOAN_AMOUNT: string = '280';
  static readonly SHORT_SORT_CODE: string = '0101';
  static readonly SHORT_ACCOUNT_NUMBER: string = '12345';
  static readonly LONG_SORT_CODE: string = '999999999999999999';
  static readonly LONG_ACCOUNT_NUMBER: string = '123456789';
  static readonly ACCOUNT_NAME: string = 'Test account';
  static readonly SORT_CODE_WITH_SYMBOL: string = '$10101';
  static readonly ACCOUNT_NUMBER_WITH_SYMBOL: string = '$123456789';
  static readonly SORT_CODE_WITH_LETTERS: string = 'dsfdsfsdfs';
  static readonly ACCOUNT_NUMBER_WITH_LETTERS: string = 'fsfs';
  static readonly SHORT_BRP_NUMBER: string = 'ZU123456';
  static readonly INPUT_FULL_NAME: string = 'Automation Tester';
  static readonly INVALID_CALENDAR_DATE: string = '31/09/1999';
  static readonly EMPTY_VALUE: string = '';
  static readonly INVALID_EMAIL: string = 'afas@.c';
  static readonly PHONE_WITH_LETTERS: string = 'rwrwrws';
  static readonly INPUT_HELPER_FULL_NAME: string = 'Automation1 Tester';
  static readonly INPUT_HELPER_RELATIONSHIP: string = 'Friend';
  static readonly INVALID_HELPER_PHONE: string = 'test';
  static readonly INVALID_POSTCODE_BUILDING: string = 'a building';
  static readonly INVALID_POSTCODE_STREET: string = ' a street';
  static readonly INVALID_POSTCODE_CITY: string = ' city';
  static readonly NUMERIC_POSTCODE: string = '0123456';
  static readonly BUILDING: string = 'Test building';
  static readonly STREET: string = 'Test street';
  static readonly CITY: string = 'Test city';
  static readonly SHORT_POSTCODE: string = 'CR92E';
  static readonly YES = 'Yes';
  static readonly NO = 'No';
  static readonly SAVINGS_AMOUNT = this.AMOUNT_99;
  static readonly LOAN_AMOUNT = this.INPUT_LOAN_AMOUNT;
  static readonly SAS_HOF_EMAIL = requiredEnv('SAS_HOF_EMAIL');
  static readonly TELEPHONE = '01234567899';
  static readonly HELP_REASONS = 'Access to Internet-First Language-Questions Correctly-Complete the Application-Online Difficulty';
  static readonly HELPER_FULL_NAME = this.INPUT_HELPER_FULL_NAME;
  static readonly HELPER_RELATIONSHIP = this.INPUT_HELPER_RELATIONSHIP;
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
  static readonly BUILDING_SOCIETY_NAME = this.ACCOUNT_NAME;
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

  static readonly FULL_NAME = this.INPUT_FULL_NAME;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}
