@feature @apply @joint
Feature: Joint Application
  A user should be able to make a complete joint application

  @smoke_test_email
  Scenario: Complete Application - Email Only with Real Test Submission
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
    Then I should be on the 'brp' page showing 'What are your biometric residence permit (BRP) details?'
    Then I fill 'brpNumber' with 'ZU1234567'
    Then I fill 'fullName' with 'Joint Test Application'
    Then I enter a date of birth for a 30 year old
    Then I click the 'Continue' button
    Then I should be on the 'ni-number' page showing 'What is your National Insurance number?'
    Then I fill 'niNumber' with 'js111111d'
    Then I click the 'Continue' button
    Then I should be on the 'has-other-names' page showing 'Have you been known by any other names?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'add-other-name' page showing 'Full name'
    Then I fill 'otherName' with 'Test1 Test1'
    Then I click the 'Continue' button
    Then I choose 'Add another name'
    Then I fill 'otherName' with 'Test2 Test2'
    Then I click the 'Continue' button
    Then I change 'Test2 Test2'
    Then I fill 'otherName' with 'Test2 Test3'
    Then I click the 'Continue' button
    Then I delete 'Test1 Test1'
    Then I choose 'Add another name'
    Then I fill 'otherName' with 'Test4 Test4'
    Then I click the 'Continue' button
    Then I click the 'Continue' button
    Then I should be on the 'home-office-reference' page showing 'What is your Home Office reference number?'
    Then I fill 'homeOfficeReference' with 'a1234567'
    Then I click the 'Continue' button
    Then I should be on the 'partner-brp' page showing 'What are your partner’s biometric residence permit (BRP) details?'
    Then I fill 'partnerBrpNumber' with 'ZU7654321'
    Then I fill 'partnerFullName' with 'Mrs Test'
    Then I enter a 'partner' date of birth for a 28 year old
    Then I click the 'Continue' button
    Then I should be on the 'partner-ni-number' page showing 'What is your partner’s National Insurance number?'
    Then I fill 'partnerNiNumber' with 'sj222222c'
    Then I click the 'Continue' button
    Then I should be on the 'partner-has-other-names' page showing 'Has your partner been known by any other names?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'partner-add-other-name' page showing 'Full name'
    Then I fill 'partnerOtherName' with 'Mrs Test2'
    Then I click the 'Continue' button
    Then I choose 'Add another name'
    Then I fill 'partnerOtherName' with 'Mrs Test3'
    Then I click the 'Continue' button
    Then I change 'Mrs Test3'
    Then I fill 'partnerOtherName' with 'Mrs Test4'
    Then I click the 'Continue' button
    Then I delete 'Mrs Test4'
    Then I choose 'Add another name'
    Then I fill 'partnerOtherName' with 'Mrs Test5'
    Then I click the 'Continue' button
    Then I click the 'Continue' button
    Then I should be on the 'convictions-joint' page showing 'Have you or your partner ever been convicted of a crime in the UK?'
    Then I choose 'Yes'
    Then I fill 'detailsOfCrimeJoint' text area with 'Crime details'
    Then I click the 'Continue' button
    Then I should be on the 'has-dependants' page showing 'Do you have any dependants living with you?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'add-dependant' page showing 'Enter details of your dependant'
    Then I fill 'dependantFullName' with 'Little Test'
    Then I enter a 'dependant' date of birth for a 5 year old
    Then I fill 'dependantRelationship' with 'Son'
    Then I click the 'Continue' button
    Then I choose 'Add another dependant'
    Then I fill 'dependantFullName' with 'Littlette Test'
    Then I enter a 'dependant' date of birth for a 8 year old
    Then I fill 'dependantRelationship' with 'Daughter'
    Then I click the 'Continue' button
    Then I change 'Littlette Test'
    Then I fill 'dependantFullName' with 'Littlette Test2'
    Then I click the 'Continue' button
    Then I delete 'Littlette Test2'
    Then I choose 'Add another dependant'
    Then I fill 'dependantFullName' with 'Little Miss Test'
    Then I enter a 'dependant' date of birth for a 10 year old
    Then I fill 'dependantRelationship' with 'Daughter'
    Then I click the 'Continue' button
    Then I click the 'Continue' button
    Then I should be on the 'address' page showing 'What is your address in the UK?'
    Then I fill 'building' with '11 Berlin'
    Then I fill 'townOrCity' with 'London'
    Then I fill 'postcode' with 'W1 1JC'
    Then I click the 'Continue' button
    Then I should be on the 'combined-income' page showing 'You and your partner’s combined monthly income'
    Then I select 'Salary (before tax)'
    Then I fill 'combinedSalaryAmount' with '1000'
    Then I select 'Universal Credit'
    Then I fill 'combinedUniversalCreditAmount' with '100'
    Then I select 'Child benefit'
    Then I fill 'combinedChildBenefitAmount' with '200'
    Then I select 'Housing Benefit'
    Then I fill 'combinedHousingBenefitAmount' with '300'
    Then I check 'combinedIncomeTypes-other'
    Then I fill 'combinedOtherIncomeAmount' with '400'
    Then I click the 'Continue' button
    Then I should be on the 'combined-outgoings' page showing 'You and your partner’s combined monthly outgoings'
    Then I check 'combinedOutgoingTypes-rent'
    Then I fill 'combinedRentAmount' with '300'
    Then I select 'Utility (household) bills'
    Then I fill 'combinedHouseholdBillsAmount' with '100'
    Then I select 'Food, toiletries and cleaning supplies'
    Then I fill 'combinedFoodToiletriesAndCleaningSuppliesAmount' with '50'
    Then I select 'Mobile phone'
    Then I fill 'combinedMobilePhoneAmount' with '25'
    Then I select 'Travel'
    Then I fill 'combinedTravelAmount' with '20'
    Then I select 'Clothing and footwear'
    Then I fill 'combinedClothingAndFootwearAmount' with '15'
    Then I select 'Universal Credit deductions'
    Then I fill 'combinedUniversalCreditDeductionsAmount' with '10'
    Then I check 'combinedOutgoingTypes-other'
    Then I fill 'combinedOtherOutgoingAmount' with '75'
    Then I click the 'Continue' button
    Then I should be on the 'combined-savings' page showing 'Do you or your partner have any savings?'
    Then I choose 'Yes'
    Then I fill 'combinedSavingsAmount' with '10000'
    Then I click the 'Continue' button
    Then I should be on the 'combined-amount' page showing 'What loan amount would you like to apply for?'
    Then I fill 'jointAmount' with '555'
    Then I click the 'Continue' button
    Then I should be on the 'purpose' page showing 'What will you use the loan for?'
    Then I select 'Housing'
    Then I select 'Essential items'
    Then I select 'Basic living costs'
    Then I select 'Training or education'
    Then I select 'Work clothing and equipment'
    Then I click the 'Continue' button
    Then I should be on the 'bank-details' page showing 'What are your bank or building society account details?'
    Then I fill 'accountName' with 'Account name'
    Then I fill 'sortCode' with '111111'
    Then I fill 'accountNumber' with '222222'
    Then I fill 'rollNumber' with '23'
    Then I click the 'Continue' button
    Then I should be on the 'contact' page showing 'How would you like us to contact you?'
    Then I check 'contactTypes-email'
    Then I fill 'email' with 'sas-hof-test@digital.homeoffice.gov.uk'
    Then I click the 'Continue' button
    Then I should be on the 'help' page showing 'Did you get any help making this application?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'help-reasons' page showing 'Why did you need help?'
    Then I select 'I don’t have access to the internet'
    Then I select 'English is not my first language'
    Then I select 'I’m not confident to answer the questions correctly'
    Then I select 'It was faster to complete the application'
    Then I select 'I have a health condition which makes completing the form online difficult'
    Then I click the 'Continue' button
    Then I should be on the 'who-helped' page showing 'What are the details of the person who helped you?'
    Then I fill 'helpFullName' with 'Uncle Test'
    Then I fill 'helpRelationship' with 'Uncle'
    Then I select 'Email'
    Then I fill 'helpEmail' with 'sas-hof-test@digital.homeoffice.gov.uk'
    Then I click the 'Continue' button
    Then I should be on the 'confirm' page showing 'Check your answers before sending your application'
    Then I should see 'Applicant’s details' on the page
    Then I should see 'Have you been known by any other names?' on the page
    Then I should see 'Other names' on the page
    Then I should see 'Partner’s details' on the page
    Then I should see 'Has your partner been known by any other names?' on the page
    Then I should see "Partner's other names" on the page
    Then I should see 'Bank account details' on the page
    Then I should see 'Criminal convictions' on the page
    Then I should see 'Income' on the page
    Then I should see 'Outgoings' on the page
    Then I should see 'Savings' on the page
    Then I should see 'Loan details' on the page
    Then I should see 'Address' on the page
    Then I should see 'Contact details' on the page
    Then I should see 'Do you have any dependants living with you?' on the page
    Then I should see 'Your dependants' on the page
    Then I should see 'Help with application' on the page
    Then I should see 'Other details' on the page
    Then I should see 'Now send your application' on the page
    Then I submit the application

  Scenario: Simple application - Phone Only with new address
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
    Then I should be on the 'brp' page showing 'What are your biometric residence permit (BRP) details?'
    Then I fill 'brpNumber' with 'ZU1234567'
    Then I fill 'fullName' with 'Mr Test'
    Then I enter a date of birth for a 30 year old
    Then I click the 'Continue' button
    Then I should be on the 'ni-number' page showing 'What is your National Insurance number?'
    Then I fill 'niNumber' with 'js111111d'
    Then I click the 'Continue' button
    Then I should be on the 'has-other-names' page showing 'Have you been known by any other names?'
    Then I check 'hasOtherNames-no'
    Then I click the 'Continue' button
    Then I should be on the 'home-office-reference' page showing 'What is your Home Office reference number?'
    Then I fill 'homeOfficeReference' with 'a1234567'
    Then I click the 'Continue' button
    Then I should be on the 'partner-brp' page showing 'What are your partner’s biometric residence permit (BRP) details?'
    Then I fill 'partnerBrpNumber' with 'ZU7654321'
    Then I fill 'partnerFullName' with 'Mrs Test'
    Then I enter a 'partner' date of birth for a 28 year old
    Then I click the 'Continue' button
    Then I should be on the 'partner-ni-number' page showing 'What is your partner’s National Insurance number?'
    Then I fill 'partnerNiNumber' with 'sj222222c'
    Then I click the 'Continue' button
    Then I should be on the 'partner-has-other-names' page showing 'Has your partner been known by any other names?'
    Then I check 'partnerHasOtherNames-no'
    Then I click the 'Continue' button
    Then I should be on the 'convictions-joint' page showing 'Have you or your partner ever been convicted of a crime in the UK?'
    Then I choose 'Yes'
    Then I fill 'detailsOfCrimeJoint' text area with 'Crime details'
    Then I click the 'Continue' button
    Then I should be on the 'has-dependants' page showing 'Do you have any dependants living with you?'
    Then I choose 'No'
    Then I click the 'Continue' button
    Then I should be on the 'address' page showing 'What is your address in the UK?'
    Then I fill 'building' with '11 Berlin'
    Then I fill 'townOrCity' with 'London'
    Then I fill 'postcode' with 'W1 1JC'
    Then I click the 'Continue' button
    Then I should be on the 'combined-income' page showing 'You and your partner’s combined monthly income'
    Then I select 'Salary (before tax)'
    Then I fill 'combinedSalaryAmount' with '1000'
    Then I click the 'Continue' button
    Then I should be on the 'combined-outgoings' page showing 'You and your partner’s combined monthly outgoings'
    Then I check 'combinedOutgoingTypes-rent'
    Then I fill 'combinedRentAmount' with '300'
    Then I click the 'Continue' button
    Then I should be on the 'combined-savings' page showing 'Do you or your partner have any savings?'
    Then I choose 'No'
    Then I click the 'Continue' button
    Then I should be on the 'combined-amount' page showing 'What loan amount would you like to apply for?'
    Then I fill 'jointAmount' with '555'
    Then I click the 'Continue' button
    Then I should be on the 'purpose' page showing 'What will you use the loan for?'
    Then I select 'Housing'
    Then I click the 'Continue' button
    Then I should be on the 'bank-details' page showing 'What are your bank or building society account details?'
    Then I fill 'accountName' with 'Account name'
    Then I fill 'sortCode' with '111111'
    Then I fill 'accountNumber' with '222222'
    Then I fill 'rollNumber' with '23'
    Then I click the 'Continue' button
    Then I should be on the 'contact' page showing 'How would you like us to contact you?'
    Then I select 'Phone'
    Then I fill 'phone' with '07955555555'
    Then I click the 'Continue' button
    Then I should be on the 'outcome' page showing 'Receiving your application decision'
    Then I select 'Yes - add another address'
    Then I fill 'outcomeBuilding' with 'new address'
    Then I fill 'outcomeTownOrCity' with 'london'
    Then I fill 'outcomePostcode' with 'N1 3AB'
    Then I click the 'Continue' button
    Then I should be on the 'help' page showing 'Did you get any help making this application?'
    Then I choose 'Yes'
    Then I click the 'Continue' button
    Then I should be on the 'help-reasons' page showing 'Why did you need help?'
    Then I select 'I don’t have access to the internet'
    Then I click the 'Continue' button
    Then I should be on the 'who-helped' page showing 'What are the details of the person who helped you?'
    Then I fill 'helpFullName' with 'Uncle Test'
    Then I fill 'helpRelationship' with 'Uncle'
    Then I select 'Phone'
    Then I fill 'helpPhone' with '07955555555'
    Then I click the 'Continue' button
    Then I should be on the 'confirm' page showing 'Check your answers before sending your application'
    Then I should see 'Applicant’s details' on the page
