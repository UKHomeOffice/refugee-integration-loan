@feature @apply @eligible
Feature: Eligible Application
  A user should be able to make an application if they and their partner are eligible

  Scenario: Single Application but has no partner - No previous applications made
    Given I start the 'apply' application journey
    Then I should be on the 'previously-applied' page showing 'Have you or anyone currently living at your address applied for an integration loan before?'
    Then I choose 'No'
    Then I click the 'Continue' button
    Then I should be on the 'partner' page showing 'Do you have a partner with you in the UK?'
    Then I choose 'No'
    Then I click the 'Continue' button
    Then I should be on the 'brp' page showing 'Biometric residence permit details'

  Scenario: Single Application but has partner - No previous applications made
    Given I start the 'apply' application journey
    Then I should be on the 'previously-applied' page showing 'Have you or anyone currently living at your address applied for an integration loan before?'
    Then I choose 'No'
    Then I click the 'Continue' button
    Then I should be on the 'partner' page showing 'Do you have a partner with you in the UK?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'joint' page showing 'Are you applying for a loan together with your partner?'
    Then I choose 'No'
    Then I click the 'Continue' button
    Then I should be on the 'brp' page showing 'Biometric residence permit details'

  Scenario: Single Application but has no partner - Previous applications were not granted a loan
    Given I start the 'apply' application journey
    Then I should be on the 'previously-applied' page showing 'Have you or anyone currently living at your address applied for an integration loan before?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'previous' page showing 'Was the loan granted?'
    Then I choose 'No'
    Then I click the 'Continue' button
    Then I should be on the 'partner' page showing 'Do you have a partner with you in the UK?'
    Then I choose 'No'
    Then I click the 'Continue' button
    Then I should be on the 'brp' page showing 'Biometric residence permit details'

  Scenario: Single Application but has no partner - A 3rd party at the same address was granted a loan
    Given I start the 'apply' application journey
    Then I should be on the 'previously-applied' page showing 'Have you or anyone currently living at your address applied for an integration loan before?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'previous' page showing 'Was the loan granted?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'who-received-previous-loan' page showing 'Who received the integration loan?'
    Then I choose 'Another person living at my address'
    Then I click the 'Continue' button
    Then I should be on the 'partner' page showing 'Do you have a partner with you in the UK?'
    Then I choose 'No'
    Then I click the 'Continue' button
    Then I should be on the 'brp' page showing 'Biometric residence permit details'

  Scenario: Single Application but has partner - Previous applications were not granted a loan
    Given I start the 'apply' application journey
    Then I should be on the 'previously-applied' page showing 'Have you or anyone currently living at your address applied for an integration loan before?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'previous' page showing 'Was the loan granted?'
    Then I choose 'No'
    Then I click the 'Continue' button
    Then I should be on the 'partner' page showing 'Do you have a partner with you in the UK?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'joint' page showing 'Are you applying for a loan together with your partner?'
    Then I choose 'No'
    Then I click the 'Continue' button
    Then I should be on the 'brp' page showing 'Biometric residence permit details'

  Scenario: Single Application but has partner - A 3rd party at the same address was granted a loan
    Given I start the 'apply' application journey
    Then I should be on the 'previously-applied' page showing 'Have you or anyone currently living at your address applied for an integration loan before?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'previous' page showing 'Was the loan granted?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'who-received-previous-loan' page showing 'Who received the integration loan?'
    Then I choose 'Another person living at my address'
    Then I click the 'Continue' button
    Then I should be on the 'partner' page showing 'Do you have a partner with you in the UK?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'joint' page showing 'Are you applying for a loan together with your partner?'
    Then I choose 'No'
    Then I click the 'Continue' button
    Then I should be on the 'brp' page showing 'Biometric residence permit details'

  Scenario: Joint Application - No previous applications made
    Given I start the 'apply' application journey
    Then I should be on the 'previously-applied' page showing 'Have you or anyone currently living at your address applied for an integration loan before?'
    Then I choose 'No'
    Then I click the 'Continue' button
    Then I should be on the 'partner' page showing 'Do you have a partner with you in the UK?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'joint' page showing 'Are you applying for a loan together with your partner?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'brp' page showing 'Biometric residence permit details'

  Scenario: Joint Application - Previous applications were not granted a loan
    Given I start the 'apply' application journey
    Then I should be on the 'previously-applied' page showing 'Have you or anyone currently living at your address applied for an integration loan before?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'previous' page showing 'Was the loan granted?'
    Then I choose 'No'
    Then I click the 'Continue' button
    Then I should be on the 'partner' page showing 'Do you have a partner with you in the UK?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'joint' page showing 'Are you applying for a loan together with your partner?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'brp' page showing 'Biometric residence permit details'

  Scenario: Joint Application - A 3rd party at the same address was granted a loan
    Given I start the 'apply' application journey
    Then I should be on the 'previously-applied' page showing 'Have you or anyone currently living at your address applied for an integration loan before?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'previous' page showing 'Was the loan granted?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'who-received-previous-loan' page showing 'Who received the integration loan?'
    Then I choose 'Another person living at my address'
    Then I click the 'Continue' button
    Then I should be on the 'partner' page showing 'Do you have a partner with you in the UK?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'joint' page showing 'Are you applying for a loan together with your partner?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'brp' page showing 'Biometric residence permit details'
