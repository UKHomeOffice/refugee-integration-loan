'use strict';

const moment = require('moment');

describe('validation checks of the accept journey', () => {

  let testApp;
  let passStep;
  let initSession;
  let getUrl;
  let parseHtml;

  const SUBAPP = 'accept';
  const now = moment();

  before(function setup() {
    this.timeout(4000);
    testApp = getSupertestApp(SUBAPP);
    passStep = testApp.passStep;
    initSession = testApp.initSession;
    getUrl = testApp.getUrl;
    parseHtml = testApp.parseHtml;
  });

  describe('Reference Number Validations', () => {
    it('does not pass the Reference Number page if nothing entered', async() => {
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
    it('does not pass the BRP page if BRP Number and DOB are not entered', async() => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your BRP number in the correct format/);
      expect(validationSummary.html())
        .to.match(/Enter your date of birth in the correct format/);
    });

    it('does pass the BRP page if DOB younger than 18 years old', async() => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {
        brpNumber: 'ZU1234567',
        dateOfBirth: now.subtract(18, 'years').add(1, 'days').format('YYYY-MM-DD')
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });

    it('does pass the BRP page if DOB is 18 years old or older', async() => {
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

    it('does not pass the BRP page if DOB earlier than 1900-01-01', async() => {
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
        .to.match(/Enter your date of birth in the correct format/);
    });

    it('does pass the BRP page if DOB later than 1900-01-02', async() => {
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

    it('does not pass the BRP page if the BRP number is less than 9 characters', async() => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {
        brpNumber: '12345678',
        dateOfBirth: '2000-12-31'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your BRP number in the correct format/);
    });

    it('does not pass the BRP page if the BRP number is more than 9 characters', async() => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {
        brpNumber: '1234567890',
        dateOfBirth: '2000-12-31'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your BRP number in the correct format/);
    });
  });

});
