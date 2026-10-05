@RilRegressionCI
@RilRegression

Feature: RIL - Your address applied for an Integration Loan Before Questionnaire
  As an Integration Loan Before Questionnaire application user,
  I am able check all the navigation on all the pages in RIL forms

  Scenario: 1 - RIL - Integration Loan Questionnaire for a Person with partner - E2E scenarios
    Given I visit ril application Your address applied for an Integration Loan Before page
    When I select "Yes" and click continue button from Your address applied for an Integration Loan Before page
    Then the user should be on RIL "Was the loan granted? – Apply for a refugee integration loan – GOV.UK" page
    When I select "Yes" and click continue button from Loan Granted page
    Then the user should be on RIL "Who received the integration loan? – Apply for a refugee integration loan – GOV.UK" page
    When I select "Another person living at my address" and click continue button from Who received the integration loan page
    Then the user should be on RIL "Do you have a partner with you in the UK? – Apply for a refugee integration loan – GOV.UK" page
    When I complete the joint main applicant section and continue
    And I complete the joint dependents section and continue
    Then the user should be on RIL "What is your address in the UK? – Apply for a refugee integration loan – GOV.UK" page
    When I complete address details and continue from Address details page
    Then the user should be on RIL "You and your partner’s combined monthly income – Apply for a refugee integration loan – GOV.UK" page
    When I complete the combined loan application details of applicants and continue
    Then the user should be on RIL "What are your bank or building society account details? – Apply for a refugee integration loan – GOV.UK" page
    When I complete bank or building society account details and continue from bank or building society account details page
    Then the user should be on RIL "How would you like us to contact you? – Apply for a refugee integration loan – GOV.UK" page
    When I complete contact and help details and continue
    Then the user should be on RIL "Check your answers before sending your application – Apply for a refugee integration loan – GOV.UK" page
    When I verify Check your answers before sending your application page and continue from there
    Then the user should be on RIL "Application sent – GOV.UK" page


  Scenario: 2 - Refugee Integration Loan - Single Person with No partner - E2E scenarios
    Given I visit ril application Your address applied for an Integration Loan Before page
    When I select "Yes" and click continue button from Your address applied for an Integration Loan Before page
    Then the user should be on RIL "Was the loan granted? – Apply for a refugee integration loan – GOV.UK" page
    When I select "No" and click continue button from Loan Granted page
    Then the user should be on RIL "Do you have a partner with you in the UK? – Apply for a refugee integration loan – GOV.UK" page
    When I complete the single main applicant section and continue
    And I complete the single dependents section and continue
    Then the user should be on RIL "What is your address in the UK? – Apply for a refugee integration loan – GOV.UK" page
    When I complete address details and continue from Address details page
    Then the user should be on RIL "How much money do you receive each month? – Apply for a refugee integration loan – GOV.UK" page
    When I complete the loan details of an applicant and continue
    Then the user should be on RIL "What are your bank or building society account details? – Apply for a refugee integration loan – GOV.UK" page
    When I complete bank or building society account details and continue from bank or building society account details page
    Then the user should be on RIL "How would you like us to contact you? – Apply for a refugee integration loan – GOV.UK" page
    When I complete contact and help details and continue
    Then the user should be on RIL "Check your answers before sending your application – Apply for a refugee integration loan – GOV.UK" page
    When I verify Check your answers before sending your application page and continue from there
    Then the user should be on RIL "Application sent – GOV.UK" page


  Scenario: 3 - RIL - Integration Loan Questionnaire Scenario 1 - E2E scenarios
    Given I visit ril application Your address applied for an Integration Loan Before page
    When I select "Yes" and click continue button from Your address applied for an Integration Loan Before page
    Then the user should be on RIL "Was the loan granted? – Apply for a refugee integration loan – GOV.UK" page
    When I select "Yes" and click continue button from Loan Granted page
    Then the user should be on RIL "Who received the integration loan? – Apply for a refugee integration loan – GOV.UK" page
    When I select "Me" and click continue button from Who received the integration loan page
    Then the user should be on RIL "You cannot apply for a loan – Apply for a refugee integration loan – GOV.UK" page


  Scenario Outline: RIL - Integration Loan Questionnaire Scenario 1 and 2 - E2E scenarios
    Given I visit ril application Your address applied for an Integration Loan Before page
    And I select "<Previous Application>" and click continue button from Your address applied for an Integration Loan Before page
    Then the user should be on RIL "<PageTitle>" page
    Examples:
      | Previous Application | PageTitle                                                                                 |
      | Yes                  | Was the loan granted? – Apply for a refugee integration loan – GOV.UK                     | 
      | No                   | Do you have a partner with you in the UK? – Apply for a refugee integration loan – GOV.UK |


  Scenario Outline: 2 - Refugee Integration Loan - You cannot apply for a loan
    Given I visit ril application Your address applied for an Integration Loan Before page
    When I select "Yes" and click continue button from Your address applied for an Integration Loan Before page
    Then the user should be on RIL "Was the loan granted? – Apply for a refugee integration loan – GOV.UK" page
    When I select "Yes" and click continue button from Loan Granted page
    Then the user should be on RIL "Who received the integration loan? – Apply for a refugee integration loan – GOV.UK" page
    When I select "<Loan Recipient>" and click continue button from Who received the integration loan page
    Then the user should be on RIL "You cannot apply for a loan – Apply for a refugee integration loan – GOV.UK" page
    And the user validates the "You cannot apply for a loan – Apply for a refugee integration loan – GOV.UK" page
    Examples:
      | Loan Recipient | 
      | Me             |
      | My partner     | 


  Scenario: 4 - RIL - Integration Loan Questionnaire Scenario 2 - E2E scenarios
    Given I visit ril application Your address applied for an Integration Loan Before page
    When I select "No" and click continue button from Your address applied for an Integration Loan Before page
    Then the user should be on RIL "Do you have a partner with you in the UK? – Apply for a refugee integration loan – GOV.UK" page
    When I select "Yes" and click continue button from Do you have a partner with you in the UK page
    Then the user should be on RIL "Are you applying for a loan together with your partner? – Apply for a refugee integration loan – GOV.UK" page
