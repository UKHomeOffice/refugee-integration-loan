'use strict';

describe('submission-error', () => {
  let SubmissionError;
  let translations;
  let options;
  let genericSubmissionError;
  let submissionFailedError;
  let submissionFailedOptions;
  let defaultSubmissionError;

  beforeEach(() => {
    SubmissionError = require('../../../../../apps/common/behaviours/submission-error');
    translations = require('../translations/src/en/errors.json');

    options = {
      type: 'testType',
      message: 'Test error message',
      translations: translations
    };

    submissionFailedOptions = {
      type: 'submissionFailed',
      message: 'Error submitting form',
      translations: translations
    };

    genericSubmissionError = new SubmissionError('testkey', options);
    submissionFailedError = new SubmissionError('submissionFailed', submissionFailedOptions);
    defaultSubmissionError = new SubmissionError('anotherType', {translations: translations});
  });

  it('sets the given key', () => {
    genericSubmissionError.key.should.equal('testkey');
  });

  it('sets the given options', () => {
    genericSubmissionError.type.should.equal('testType');
    genericSubmissionError.message.should.equal('Test error message');
    genericSubmissionError.translations.should.equal(translations);
  });

  it('sets the given options for submission error type', () => {
    submissionFailedError.type.should.equal('submissionFailed');
    submissionFailedError.message.should.equal('Error submitting form');
    submissionFailedError.translations.should.equal(translations);
  });

  it('sets the given translations for submission error type', () => {
    submissionFailedError.title.should.equal('Sorry, something went wrong');
    submissionFailedError.text1.should.equal(
      'Please try again. If the problem persists, you can contact the integration loan team at '
    );
    submissionFailedError.helpEmail.should.equal('Integrationloan@homeoffice.gov.uk');
  });

  it('sets the given translations for default type', () => {
    defaultSubmissionError.title.should.equal('Default error title');
    defaultSubmissionError.text1.should.equal('Default error text 1');
    defaultSubmissionError.helpEmail.should.equal('Integrationloan@homeoffice.gov.uk');
  });
});
