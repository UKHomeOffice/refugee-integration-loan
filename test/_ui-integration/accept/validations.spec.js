
const moment = require('moment');

describe('validation checks of the accept journey', () => {
  let testApp;
  let passStep;
  let initSession;
  let getUrl;
  let parseHtml;

  const SUBAPP = 'accept';
  let now;

  before(() => {
    testApp = getSupertestApp(SUBAPP);
    passStep = testApp.passStep;
    initSession = testApp.initSession;
    getUrl = testApp.getUrl;
    parseHtml = testApp.parseHtml;
  });

  beforeEach(() => {
    now = moment();
  });

  describe('Reference Number Validations', () => {
    it('does not pass the Reference Number page if nothing entered', async () => {
      const URI = '/reference-number';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your loan reference number in the correct format/);
    });
  });

  describe('BRP Validations', () => {
    it('does not pass the BRP page if BRP Number and DOB are not entered', async () => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your BRP number in the correct format; for example, ‘ZU1234567’/);
      expect(validationSummary.html())
        .to.match(/Enter your date of birth in the correct format; for example, 31 3 1980/);
    });

    it('does not pass the BRP page if DOB younger than 18 years old', async () => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {
        brpNumber: 'ZU1234567',
        dateOfBirth: now.subtract(18, 'years').add(1, 'days').format('YYYY-MM-DD')
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter a valid date of birth. You must be over 18 to accept/);
    });

    it('does pass the BRP page if DOB is 18 years old or older', async () => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {
        brpNumber: 'ZU1234567',
        dateOfBirth: now.subtract(18, 'years').format('YYYY-MM-DD')
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });

    it('does not pass the BRP page if DOB earlier than 1900-01-01', async () => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {
        brpNumber: 'ZU1234567',
        dateOfBirth: '1900-01-01'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter a date after 1 1 1900/);
    });

    it('does not pass the BRP page if DOB is in the future', async () => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {
        brpNumber: 'ZU1234567',
        dateOfBirth: now.add(1, 'days').format('YYYY-MM-DD')
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter a date that is in the past/);
    });

    it('does pass the BRP page if DOB later than 1900-01-02', async () => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {
        brpNumber: 'ZU1234567',
        dateOfBirth: '1900-01-02'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });

    it('does not pass the BRP page if the BRP number is less than 10 characters', async () => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {
        brpNumber: 'ZU1234567',
        dateOfBirth: '2000-12-31'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your BRP number in the correct format; for example, ‘ZU1234567’/);
    });

    it('does not pass the BRP page if the BRP number is more than 10 characters', async () => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {
        brpNumber: 'ZU12345679',
        dateOfBirth: '2000-12-31'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your BRP number in the correct format; for example, ‘ZU1234567’/);
    });
  });

  describe('Contact Validations', () => {
    it('does not pass the Contact page if nothing entered', async () => {
      const URI = '/contact';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.contain('Select how we can contact you');
    });

    it('does not pass the Contact page if email and phone selected but not entered', async () => {
      const URI = '/contact';
      await initSession(URI);
      await passStep(URI, {
        contactTypes: [
          'email',
          'phone'
        ]
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.contain('Enter your email address in the correct format');
      expect(validationSummary.html())
        .to.contain('Enter your phone number in the correct format');
    });
  });
});
