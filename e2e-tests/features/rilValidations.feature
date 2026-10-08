@RilRegression
@RilRegressionCI

Feature: RIL - Integration Loan Before Questionnaire application form content and error validations
  As an Integration Loan Before Questionnaire application user,
  I am able validate the content displaying on all the pages across all pages of RIL form

  Scenario Outline: RIL - Integration Loan Questionnaire application content validations
    Given I visit ril application Your address applied for an Integration Loan Before page
    And I validate the content on Your address applied for an Integration Loan Before page
    And I validate the content on Loan Granted page
    And I validate the content on Who received the integration loan page
    Then the user should be on RIL "Do you have a partner with you in the UK? – Apply for a refugee integration loan – GOV.UK" page
    When I validate main applicant and dependant sections content and continue
    Then the user should be on RIL "What is your address in the UK? – Apply for a refugee integration loan – GOV.UK" page
    When I validate address details and continue
    Then the user should be on RIL "You and your partner’s combined monthly income – Apply for a refugee integration loan – GOV.UK" page
    When I validate the loan details of an applicants and continue
    Then the user should be on RIL "What are your bank or building society account details? – Apply for a refugee integration loan – GOV.UK" page
    When I validate bank or building society account details and continue
    Then the user should be on RIL "How would you like us to contact you? – Apply for a refugee integration loan – GOV.UK" page
    When I validate contact and help details and continue
    Then the user should be on RIL "Check your answers before sending your application – Apply for a refugee integration loan – GOV.UK" page
    When I validate the content on the Check your answers before sending your application page and continue
    Then the user should be on RIL "Application sent – GOV.UK" page
    And I validate the Application sent page
    Examples:
      | Description                                           |
      | Integration Loan application form content validations |


  Scenario Outline: RIL - Integration Loan Questionnaire application error validations
    Given I visit ril application Your address applied for an Integration Loan Before page
    And I validate Your address applied for an Integration Loan Before selection page error messages and continue
    And I validate Loan Granted selection page error messages and continue
    And I validate Who received the integration loan page and continue
    Then the user should be on RIL "Do you have a partner with you in the UK? – Apply for a refugee integration loan – GOV.UK" page
    When I validate main applicant and dependant sections errors and continue
    Then the user should be on RIL "What is your address in the UK? – Apply for a refugee integration loan – GOV.UK" page
    When I validate address details errors and continue
    Then the user should be on RIL "You and your partner’s combined monthly income – Apply for a refugee integration loan – GOV.UK" page
    When I validate the loan details of an applicants errors and continue
    Then the user should be on RIL "What are your bank or building society account details? – Apply for a refugee integration loan – GOV.UK" page
    When I validate bank or building society account details errors and continue
    Then the user should be on RIL "How would you like us to contact you? – Apply for a refugee integration loan – GOV.UK" page
    When I validate contact and help details selection errors and continue
    Then the user should be on RIL "Check your answers before sending your application – Apply for a refugee integration loan – GOV.UK" page
    Examples:
      | Description                                               |
      | Your address applied for an Integration Loan Before - Yes |
