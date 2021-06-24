@feature @apply @ineligible
Feature: Ineligible Application
  A user should not be able to complete an application if they or their partner are ineligible

  Scenario: Ineligible application - Loan already granted to applicant
    Given I start the 'apply' application journey
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I check 'whoReceivedPreviousLoan-me'
    Then I click the 'Continue' button
    Then I should be on the 'ineligible' page showing 'You cannot apply for a loan'
    Then I should see 'As you or your partner have already received an integration loan, you cannot apply again.' on the page
    Then I should see 'Your local refugee community organisation may be able to tell you what other support is available.' on the page

  Scenario: Ineligible application - Loan already granted to partner
    Given I start the 'apply' application journey
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I choose 'My partner'
    Then I click the 'Continue' button
    Then I should be on the 'ineligible' page showing 'You cannot apply for a loan'
    Then I should see 'As you or your partner have already received an integration loan, you cannot apply again.' on the page
    Then I should see 'Your local refugee community organisation may be able to tell you what other support is available.' on the page
