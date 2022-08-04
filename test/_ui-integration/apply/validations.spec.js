
const moment = require('moment');

describe.only('validation checks of the apply journey', () => {
  let testApp;
  let passStep;
  let initSession;
  let getUrl;
  let parseHtml;

  const SUBAPP = 'apply';
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

  describe('Previously Applied Validations', () => {
    it('does not pass the previously applied page if nothing entered', async () => {
      const URI = '/previously-applied';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select if you or someone else at your address have previously applied for a loan/);
    });
  });

  describe('Previous Validations', () => {
    it('does not pass the Previous page if nothing entered', async () => {
      const URI = '/previous';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select if the loan was granted or not/);
    });
  });

  describe('Who Received Previous Loan Validations', () => {
    it('does not pass the Who Received Previous Loan page if nothing entered', async () => {
      const URI = '/who-received-previous-loan';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select who was granted the loan/);
    });
  });

  describe('Partner Validations', () => {
    it('does not pass the Partner page if nothing entered', async () => {
      const URI = '/partner';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select if you have a partner with you in the UK or not/);
    });
  });

  describe('Joint Validations', () => {
    it('does not pass the Joint page if nothing entered', async () => {
      const URI = '/joint';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select if you are applying for a loan together with your partner/);
    });
  });

  describe('BRP Validations', () => {
    it('does not pass the BRP page if BRP Number, Name and DOB are not entered', async () => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your BRP number in the correct format; for example, ‘ZUX123456 or ZU1234567’/);
      expect(validationSummary.html())
        .to.match(/Enter your full name/);
      expect(validationSummary.html())
        .to.match(/Enter your date of birth in the correct format; for example, 31 3 1980/);
    });

    it('does not pass the BRP page if DOB younger than 18 years old', async () => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {
        brpNumber: 'ZU1234567',
        fullName: 'Joe Bloggs',
        dateOfBirth: now.subtract(18, 'years').add(1, 'days').format('YYYY-MM-DD')
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter a valid date of birth. You must be over 18 to apply/);
    });

    it('does pass the BRP page if DOB is 18 years old or older', async () => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {
        brpNumber: 'ZU1234567',
        fullName: 'Joe Bloggs',
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
        fullName: 'Joe Bloggs',
        dateOfBirth: '1900-01-01'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter a date after 1 1 1900/);
    });

    it('does pass the BRP page if DOB later than 1900-01-02', async () => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {
        brpNumber: 'ZU1234567',
        fullName: 'Joe Bloggs',
        dateOfBirth: '1900-01-02'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });

    it('does not pass the BRP page if DOB is in the future', async () => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {
        brpNumber: 'ZU1234567',
        fullName: 'Joe Bloggs',
        dateOfBirth: now.add(1, 'days').format('YYYY-MM-DD')
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter a date that is in the past/);
    });


    it('does not pass the BRP page if the BRP number is less than 9 characters', async () => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {
        brpNumber: 'ZUX12345',
        fullName: 'Joe Bloggs',
        dateOfBirth: '2000-12-31'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your BRP number in the correct format; for example, ‘ZUX123456 or ZU1234567’/);
    });

    it('does not pass the BRP page if the BRP number is more than 9 characters', async () => {
      const URI = '/brp';
      await initSession(URI);
      await passStep(URI, {
        brpNumber: 'ZUX1234567',
        fullName: 'Joe Bloggs',
        dateOfBirth: '2000-12-31'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your BRP number in the correct format; for example, ‘ZUX123456 or ZU1234567’/);
    });
  });

  describe('NI Number Validations', () => {
    it('does not pass the NI Number page if nothing entered', async () => {
      const URI = '/ni-number';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your National Insurance number in the correct format; for example, 'QQ 12 34 56 C'/);
    });

    it('does not pass the NI Number page if in the wrong format', async () => {
      const URI = '/ni-number';
      await initSession(URI);
      await passStep(URI, {
        niNumber: 'qq111111z'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your National Insurance number in the correct format; for example, 'QQ 12 34 56 C'/);
    });

    it('does pass the NI Number page if in the correct format', async () => {
      const URI = '/ni-number';
      await initSession(URI);
      await passStep(URI, {
        niNumber: 'jy111111d'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });

    it('does pass the NI Number page if the number is mixed case', async () => {
      const URI = '/ni-number';
      await initSession(URI);
      await passStep(URI, {
        niNumber: 'JY111111d'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });
  });

  describe('Other Name Validations', () => {
    it('does not pass the Has Other Names page if nothing entered', async () => {
      const URI = '/has-other-names';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select if you have been known by any other names/);
    });

    it('does not pass the add other name page if full name is not entered', async () => {
      const URI = '/add-other-name';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html()).to.match(/Enter a full name/);
    });
  });

  describe('Home Office Reference Validations', () => {
    it('does not pass the Home Office Reference page if nothing entered', async () => {
      const URI = '/home-office-reference';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter a Home Office reference number in the correct format; for example, ‘A1234567’ or ‘VPR1234’/);
    });
  });

  describe('Convictions Validations', () => {
    it('does not pass the Convictions page if nothing entered', async () => {
      const URI = '/convictions';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select if you have ever been convicted of a crime in the UK/);
    });

    it('does not pass the Convictions page if no crime details entered', async () => {
      const URI = '/convictions';
      await initSession(URI);
      await passStep(URI, {
        convicted: 'yes'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter details of the crime\(s\)/);
    });

    it('does not pass the Convictions page if crime details over 500 characters', async () => {
      const URI = '/convictions';
      await initSession(URI);
      const _501Chars = 'a'.repeat(501);

      await passStep(URI, {
        convicted: 'yes',
        detailsOfCrime: _501Chars
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/The details of the crime\(s\) must be 500 characters or fewer/);
    });
  });

  describe('Partner BRP Validations', () => {
    it('does not pass the Partner BRP page if BRP Number, Name and DOB are not entered', async () => {
      const URI = '/partner-brp';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your partner's BRP number in the correct format; for example, ‘ZUX123456 or ZU1234567’/);
      expect(validationSummary.html())
        .to.match(/Enter your partner's full name/);
      expect(validationSummary.html())
        .to.match(/Enter your partner's date of birth in the correct format; for example, 31 3 1980/);
    });

    it('does not pass the Partner BRP page if DOB younger than 18 years old', async () => {
      const URI = '/partner-brp';
      await initSession(URI);
      await passStep(URI, {
        partnerBrpNumber: 'ZU1234567',
        partnerFullName: 'Joe Bloggs',
        partnerDateOfBirth: now.subtract(18, 'years').add(1, 'days').format('YYYY-MM-DD')
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter a valid date of birth. You must be over 18 to apply/);
    });

    it('does pass the Partner BRP page if DOB is 18 years old or older', async () => {
      const URI = '/partner-brp';
      await initSession(URI);
      await passStep(URI, {
        partnerBrpNumber: 'ZU1234567',
        partnerFullName: 'Joe Bloggs',
        partnerDateOfBirth: now.subtract(18, 'years').format('YYYY-MM-DD')
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });

    it('does not pass the BRP page if partner DOB is in the future', async () => {
      const URI = '/partner-brp';
      await initSession(URI);
      await passStep(URI, {
        partnerBrpNumber: 'ZU1234567',
        partnerFullName: 'Joe Bloggs',
        partnerDateOfBirth: now.add(1, 'days').format('YYYY-MM-DD')
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter a date that is in the past/);
    });

    it('does not pass the Partner BRP page if DOB earlier than 1900-01-01', async () => {
      const URI = '/partner-brp';
      await initSession(URI);
      await passStep(URI, {
        partnerBrpNumber: 'ZU1234567',
        partnerFullName: 'Joe Bloggs',
        partnerDateOfBirth: '1900-01-01'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter a date after 1 1 1900/);
    });

    it('does pass the Partner BRP page if DOB later than 1900-01-02', async () => {
      const URI = '/partner-brp';
      await initSession(URI);
      await passStep(URI, {
        partnerBrpNumber: 'ZU1234567',
        partnerFullName: 'Joe Bloggs',
        partnerDateOfBirth: '1900-01-02'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });

    it('does not pass the Partner BRP page if the BRP number is less than 9 characters', async () => {
      const URI = '/partner-brp';
      await initSession(URI);
      await passStep(URI, {
        partnerBrpNumber: '12345678',
        partnerFullName: 'Joe Bloggs',
        partnerDateOfBirth: '2000-12-31'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your partner's BRP number in the correct format; for example, ‘ZUX123456 or ZU1234567’/);
    });

    it('does not pass the Partner BRP page if the BRP number is more than 9 characters', async () => {
      const URI = '/partner-brp';
      await initSession(URI);
      await passStep(URI, {
        partnerBrpNumber: '1234567890',
        partnerFullName: 'Joe Bloggs',
        partnerDateOfBirth: '2000-12-31'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your partner\'s BRP number in the correct format; for example, ‘ZUX123456 or ZU1234567’/);
    });
  });

  describe('Partner NI Number Validations', () => {
    it('does not pass the Partner NI Number page if nothing entered', async () => {
      const URI = '/partner-ni-number';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your partner's National Insurance number in the correct format; for example, 'QQ 12 34 56 C'/);
    });

    it('does not pass the Partner NI Number page if in the wrong format', async () => {
      const URI = '/partner-ni-number';
      await initSession(URI);
      await passStep(URI, {
        partnerNiNumber: 'qq111111z'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your partner's National Insurance number in the correct format; for example, 'QQ 12 34 56 C'/);
    });

    it('does pass the Partner NI Number page if in the correct format', async () => {
      const URI = '/partner-ni-number';
      await initSession(URI);
      await passStep(URI, {
        partnerNiNumber: 'jy111111d'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });

    it('does pass the Partner NI Number page if the number is mixed case', async () => {
      const URI = '/partner-ni-number';
      await initSession(URI);
      await passStep(URI, {
        partnerNiNumber: 'JY111111d'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });
  });

  describe('Partner Has Other Name Validations', () => {
    it('does not pass the Partner Has Other Names page if nothing entered', async () => {
      const URI = '/partner-has-other-names';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select if your partner has been known by any other names/);
    });

    it('does not pass the partner add other name page if full name is not entered', async () => {
      const URI = '/partner-add-other-name';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html()).to.match(/Enter a full name/);
    });
  });

  describe('Joint Convictions Validations', () => {
    it('does not pass the Joint Convictions page if nothing entered', async () => {
      const URI = '/convictions-joint';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select if you or your partner have ever been convicted of a crime in the UK/);
    });

    it('does not pass the Joint Convictions page if no crime details entered', async () => {
      const URI = '/convictions-joint';
      await initSession(URI);
      await passStep(URI, {
        convictedJoint: 'yes'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter details of the crime\(s\)/);
    });
  });

  it('does not pass the Joint Convictions page if crime details over 500 characters', async () => {
    const URI = '/convictions-joint';
    await initSession(URI);
    const _501Chars = 'a'.repeat(501);

    await passStep(URI, {
      convictedJoint: 'yes',
      detailsOfCrimeJoint: _501Chars
    });

    const res = await getUrl(URI);
    const docu = await parseHtml(res);
    const validationSummary = docu.find('.validation-summary');

    expect(validationSummary.length === 1).to.be.true;
    expect(validationSummary.html())
      .to.match(/The details of the crime\(s\) must be 500 characters or fewer/);
  });

  describe('Dependants Validations', () => {
    it('does not pass the has dependants page if nothing entered', async () => {
      const URI = '/has-dependants';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select if you have any dependants living with you/);
    });

    it('does not pass the add dependant page if Name, DOB, and Relationship to you are not entered are not entered',
      async () => {
        const URI = '/add-dependant';
        await initSession(URI);
        await passStep(URI, {});

        const res = await getUrl(URI);
        const docu = await parseHtml(res);
        const validationSummary = docu.find('.validation-summary');

        expect(validationSummary.length === 1).to.be.true;
        expect(validationSummary.html())
          .to.match(/Enter the dependant's relationship to you/);
        expect(validationSummary.html())
          .to.match(/Enter dependant's full name/);
        expect(validationSummary.html())
          .to.match(/Enter dependant's date of birth in the correct format; for example, 31 3 1980/);
      });

    it('does not pass the add dependant page if the dependant\'s DOB is in the future',
      async () => {
        const URI = '/add-dependant';
        await initSession(URI);
        await passStep(URI, {
          dependantFullName: 'John Doe',
          dependantRelationship: 'Son',
          dependantDateOfBirth: now.add(1, 'days').format('YYYY-MM-DD')
        });

        const res = await getUrl(URI);
        const docu = await parseHtml(res);
        const validationSummary = docu.find('.validation-summary');

        expect(validationSummary.length === 1).to.be.true;
        expect(validationSummary.html())
          .to.match(/Enter a date that is in the past/);
      });
  });

  describe('Address Validations', () => {
    it('does not pass the Address page if nothing entered', async () => {
      const URI = '/address';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter details of your building and street/);
      expect(validationSummary.html())
        .to.match(/Enter a town or city/);
      expect(validationSummary.html())
        .to.match(/Enter your postcode/);
    });
  });

  describe('Income Validations', () => {
    it('does not pass the Income page if nothing entered', async () => {
      const URI = '/income';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select options for your monthly income/);
    });

    it('does not pass the Income page if numbers entered are negative', async () => {
      const URI = '/income';
      await initSession(URI);
      await passStep(URI, {
        incomeTypes: [
          'salary',
          'universal_credit',
          'child_benefit',
          'housing_benefit',
          'other'
        ],
        salaryAmount: '-2000',
        universalCreditAmount: '-100',
        childBenefitAmount: '-200',
        housingBenefitAmount: '-300',
        otherIncomeAmount: '-400'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Salary amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Universal Credit amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Child benefit amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Housing benefit amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Other income amount must be greater than zero/);
    });

    it('does not pass the Income page if numbers entered are more than 2 decimal places', async () => {
      const URI = '/income';
      await initSession(URI);
      await passStep(URI, {
        incomeTypes: [
          'salary',
          'universal_credit',
          'child_benefit',
          'housing_benefit',
          'other'
        ],
        salaryAmount: '2000.111',
        universalCreditAmount: '100.111',
        childBenefitAmount: '200.111',
        housingBenefitAmount: '300.111',
        otherIncomeAmount: '400.111'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Salary must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Universal Credit must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Child benefit must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Housing benefit must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Other income must be in pounds and pence; for example £100.00/);
    });

    it('does not pass the Income page if income types selected with no amounts', async () => {
      const URI = '/income';
      await initSession(URI);
      await passStep(URI, {
        incomeTypes: [
          'salary',
          'universal_credit',
          'child_benefit',
          'housing_benefit',
          'other'
        ]
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter total salary amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total Universal Credit amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total child benefit amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total housing benefit amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total other income amount per month/);
    });
  });

  describe('Outgoings Validations', () => {
    it('does not pass the Outgoings page if nothing entered', async () => {
      const URI = '/outgoings';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select at least one option for your monthly outgoings/);
    });

    it('does not pass the Outgoings page if numbers entered are negative', async () => {
      const URI = '/outgoings';
      await initSession(URI);
      await passStep(URI, {
        outgoingTypes: [
          'rent',
          'household_bills',
          'food_toiletries_cleaning_supplies',
          'mobile_phone',
          'travel',
          'clothing_and_footwear',
          'universal_credit_deductions',
          'other'
        ],
        rentAmount: '-1000',
        householdBillsAmount: '-100',
        foodToiletriesAndCleaningSuppliesAmount: '-50',
        mobilePhoneAmount: '-25',
        travelAmount: '-10',
        clothingAndFootwearAmount: '-20',
        universalCreditDeductionsAmount: '-30',
        otherOutgoingAmount: '-40'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Rent amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Household bills amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Food, toiletries and cleaning supplies amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Mobile phone amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Travel amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Clothing and footwear amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Universal Credit deductions must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Other outgoings amount must be greater than zero/);
    });

    it('does not pass the Outgoings page if numbers entered are more than 2 decimal places', async () => {
      const URI = '/outgoings';
      await initSession(URI);
      await passStep(URI, {
        outgoingTypes: [
          'rent',
          'household_bills',
          'food_toiletries_cleaning_supplies',
          'mobile_phone',
          'travel',
          'clothing_and_footwear',
          'universal_credit_deductions',
          'other'
        ],
        rentAmount: '1000.111',
        householdBillsAmount: '100.111',
        foodToiletriesAndCleaningSuppliesAmount: '50.111',
        mobilePhoneAmount: '25.111',
        travelAmount: '10.111',
        clothingAndFootwearAmount: '20.111',
        universalCreditDeductionsAmount: '30.111',
        otherOutgoingAmount: '40.111'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Rent must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Household bills amount must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Food, toiletries and cleaning supplies amount must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Mobile phone amount must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Travel amount must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Clothing and footwear amount must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Universal Credit deductions must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Other outgoings amount must be in pounds and pence; for example £100.00/);
    });

    it('does not pass the Outgoings page if outgoings types selected with no amounts', async () => {
      const URI = '/outgoings';
      await initSession(URI);
      await passStep(URI, {
        outgoingTypes: [
          'rent',
          'household_bills',
          'food_toiletries_cleaning_supplies',
          'mobile_phone',
          'travel',
          'clothing_and_footwear',
          'universal_credit_deductions',
          'other'
        ]
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter total rent amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total utility bills amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total food, toiletries and cleaning supplies amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total mobile phone amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total travel amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total clothing and footwear amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total Universal Credit deductions amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total other outgoings per month/);
    });
  });

  describe('Savings Validations', () => {
    it('does not pass the Savings page if nothing entered', async () => {
      const URI = '/savings';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select if you have any savings/);
    });

    it('does not pass the Savings page if no savings amount entered', async () => {
      const URI = '/savings';
      await initSession(URI);
      await passStep(URI, {
        savings: 'yes'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter total amount of savings/);
    });

    it('does not pass the Savings page if savings amount entered is negative', async () => {
      const URI = '/savings';
      await initSession(URI);
      await passStep(URI, {
        savings: 'yes',
        savingsAmount: '-10'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Total amount of savings must be greater than zero/);
    });

    it('does not pass the Savings page if savings amount entered are more than 2 decimal places', async () => {
      const URI = '/savings';
      await initSession(URI);
      await passStep(URI, {
        savings: 'yes',
        savingsAmount: '10.111'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Total amount of savings must be in pounds and pence; for example £100.00/);
    });
  });

  describe('Amount Validations', () => {
    it('does not pass the Amount page if nothing entered', async () => {
      const URI = '/amount';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter loan amount/);
    });

    it('does not pass the Amount page if amount entered is less than 100', async () => {
      const URI = '/amount';
      await initSession(URI);
      await passStep(URI, {
        amount: '99'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter loan amount between £100.00 and £500.00 in pounds and pence/);
    });

    it('does pass the Amount page if amount entered is 100 or more', async () => {
      const URI = '/amount';
      await initSession(URI);
      await passStep(URI, {
        amount: '100'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });

    it('does not pass the Amount page if amount entered is more than 500', async () => {
      const URI = '/amount';
      await initSession(URI);
      await passStep(URI, {
        amount: '501'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter loan amount between £100.00 and £500.00 in pounds and pence/);
    });

    it('does pass the Amount page if amount entered is less than 500', async () => {
      const URI = '/amount';
      await initSession(URI);
      await passStep(URI, {
        amount: '500'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });

    it('does not pass the Amount page if amount entered is more than 2 decimal places', async () => {
      const URI = '/amount';
      await initSession(URI);
      await passStep(URI, {
        amount: '250.111'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter loan amount between £100.00 and £500.00 in pounds and pence/);
    });
  });

  describe('Combined Income Validations', () => {
    it('does not pass the Combined Income page if nothing entered', async () => {
      const URI = '/combined-income';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select options for you and your partner\'s monthly income/);
    });

    it('does not pass the Combined Income page if numbers entered are negative', async () => {
      const URI = '/combined-income';
      await initSession(URI);
      await passStep(URI, {
        combinedIncomeTypes: [
          'salary',
          'universal_credit',
          'child_benefit',
          'housing_benefit',
          'other'
        ],
        combinedSalaryAmount: '-2000',
        combinedUniversalCreditAmount: '-100',
        combinedChildBenefitAmount: '-200',
        combinedHousingBenefitAmount: '-300',
        combinedOtherIncomeAmount: '-400'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Salary amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Universal Credit amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Child benefit amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Housing benefit amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Other income amount must be greater than zero/);
    });

    it('does not pass the Combined Income page if numbers entered are more than 2 decimal places', async () => {
      const URI = '/combined-income';
      await initSession(URI);
      await passStep(URI, {
        combinedIncomeTypes: [
          'salary',
          'universal_credit',
          'child_benefit',
          'housing_benefit',
          'other'
        ],
        combinedSalaryAmount: '2000.111',
        combinedUniversalCreditAmount: '100.111',
        combinedChildBenefitAmount: '200.111',
        combinedHousingBenefitAmount: '300.111',
        combinedOtherIncomeAmount: '400.111'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Salary must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Universal Credit must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Child benefit must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Housing benefit must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Other income must be in pounds and pence; for example £100.00/);
    });

    it('does not pass the Combined Income page if income types selected with no amounts', async () => {
      const URI = '/combined-income';
      await initSession(URI);
      await passStep(URI, {
        combinedIncomeTypes: [
          'salary',
          'universal_credit',
          'child_benefit',
          'housing_benefit',
          'other'
        ]
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter total salary amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total Universal Credit amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total child benefit amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total housing benefit amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total other income amount per month/);
    });
  });

  describe('Combined Outgoings Validations', () => {
    it('does not pass the Combined Outgoings page if nothing entered', async () => {
      const URI = '/combined-outgoings';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select options for you and your partner\'s monthly outgoings/);
    });

    it('does not pass the Combined Outgoings page if numbers entered are negative', async () => {
      const URI = '/combined-outgoings';
      await initSession(URI);
      await passStep(URI, {
        combinedOutgoingTypes: [
          'rent',
          'household_bills',
          'food_toiletries_cleaning_supplies',
          'mobile_phone',
          'travel',
          'clothing_and_footwear',
          'universal_credit_deductions',
          'other'
        ],
        combinedRentAmount: '-1000',
        combinedHouseholdBillsAmount: '-100',
        combinedFoodToiletriesAndCleaningSuppliesAmount: '-50',
        combinedMobilePhoneAmount: '-25',
        combinedTravelAmount: '-10',
        combinedClothingAndFootwearAmount: '-20',
        combinedUniversalCreditDeductionsAmount: '-30',
        combinedOtherOutgoingAmount: '-40'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Rent amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Household bills amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Food, toiletries and cleaning supplies amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Mobile phone amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Travel amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Clothing and footwear amount must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Universal Credit deductions must be greater than zero/);
      expect(validationSummary.html())
        .to.match(/Other outgoings amount must be greater than zero/);
    });

    it('does not pass the Combined Outgoings page if numbers entered are more than 2 decimal places', async () => {
      const URI = '/combined-outgoings';
      await initSession(URI);
      await passStep(URI, {
        combinedOutgoingTypes: [
          'rent',
          'household_bills',
          'food_toiletries_cleaning_supplies',
          'mobile_phone',
          'travel',
          'clothing_and_footwear',
          'universal_credit_deductions',
          'other'
        ],
        combinedRentAmount: '1000.111',
        combinedHouseholdBillsAmount: '100.111',
        combinedFoodToiletriesAndCleaningSuppliesAmount: '50.111',
        combinedMobilePhoneAmount: '25.111',
        combinedTravelAmount: '10.111',
        combinedClothingAndFootwearAmount: '20.111',
        combinedUniversalCreditDeductionsAmount: '30.111',
        combinedOtherOutgoingAmount: '40.111'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Rent must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Household bills amount must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Food, toiletries and cleaning supplies amount must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Mobile phone amount must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Travel amount must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Clothing and footwear amount must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Universal Credit deductions must be in pounds and pence; for example £100.00/);
      expect(validationSummary.html())
        .to.match(/Other outgoings amount must be in pounds and pence; for example £100.00/);
    });

    it('does not pass the Combined Outgoings page if outgoings types selected with no amounts', async () => {
      const URI = '/combined-outgoings';
      await initSession(URI);
      await passStep(URI, {
        combinedOutgoingTypes: [
          'rent',
          'household_bills',
          'food_toiletries_cleaning_supplies',
          'mobile_phone',
          'travel',
          'clothing_and_footwear',
          'universal_credit_deductions',
          'other'
        ]
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter total rent amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total utility bills amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total food, toiletries and cleaning supplies amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total mobile phone amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total travel amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total clothing and footwear amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total Universal Credit deductions amount per month/);
      expect(validationSummary.html())
        .to.match(/Enter total other outgoings per month/);
    });
  });

  describe('Combined Savings Validations', () => {
    it('does not pass the Combined Savings page if nothing entered', async () => {
      const URI = '/combined-savings';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select if you or your partner have any savings/);
    });

    it('does not pass the Combined Savings page if no savings amount entered', async () => {
      const URI = '/combined-savings';
      await initSession(URI);
      await passStep(URI, {
        combinedSavings: 'yes'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter total amount of savings/);
    });

    it('does not pass the Combined Savings page if savings amount entered is negative', async () => {
      const URI = '/combined-savings';
      await initSession(URI);
      await passStep(URI, {
        combinedSavings: 'yes',
        combinedSavingsAmount: '-10'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Total amount of savings must be greater than zero/);
    });

    it('does not pass the Combined Savings page if savings amount entered are more than 2 decimal places', async () => {
      const URI = '/combined-savings';
      await initSession(URI);
      await passStep(URI, {
        combinedSavings: 'yes',
        combinedSavingsAmount: '10.111'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Total amount of savings must be in pounds and pence; for example £100.00/);
    });
  });

  describe('Combined Amount Validations', () => {
    it('does not pass the Combined Amount page if nothing entered', async () => {
      const URI = '/combined-amount';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter loan amount/);
    });

    it('does not pass the Combined Amount page if amount entered is less than 100', async () => {
      const URI = '/combined-amount';
      await initSession(URI);
      await passStep(URI, {
        jointAmount: '99'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter loan amount between £100.00 and £780.00 in pounds and pence/);
    });

    it('does pass the Combined Amount page if amount entered is 100 or more', async () => {
      const URI = '/combined-amount';
      await initSession(URI);
      await passStep(URI, {
        jointAmount: '100'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });

    it('does not pass the Combined Amount page if amount entered is more than 780', async () => {
      const URI = '/combined-amount';
      await initSession(URI);
      await passStep(URI, {
        jointAmount: '781'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter loan amount between £100.00 and £780.00 in pounds and pence/);
    });

    it('does pass the Combined Amount page if amount entered is less than 780', async () => {
      const URI = '/combined-amount';
      await initSession(URI);
      await passStep(URI, {
        jointAmount: '780'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });

    it('does not pass the Combined Amount page if amount entered is more than 2 decimal places', async () => {
      const URI = '/combined-amount';
      await initSession(URI);
      await passStep(URI, {
        jointAmount: '250.111'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter loan amount between £100.00 and £780.00 in pounds and pence/);
    });
  });

  describe('Purpose Validations', () => {
    it('does not pass the Purpose page if nothing entered', async () => {
      const URI = '/purpose';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select what you will use the loan for/);
    });

    it('does pass the Purpose page if one purpose entered', async () => {
      const URI = '/purpose';
      await initSession(URI);
      await passStep(URI, {
        purposeTypes: [
          'housing'
        ]
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });

    it('does pass the Purpose page if all purposes entered', async () => {
      const URI = '/purpose';
      await initSession(URI);
      await passStep(URI, {
        purposeTypes: [
          'housing',
          'essential_items',
          'basic_living_costs',
          'training_or_retraining',
          'work_clothing_and_equipment'
        ]
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });
  });

  describe('Bank Details Validations', () => {
    it('does not pass the Bank Details page if nothing entered', async () => {
      const URI = '/bank-details';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter the name on your account/);
      expect(validationSummary.html())
        .to.match(/Enter your sort code in the correct format; for example 010101/);
      expect(validationSummary.html())
        .to.match(/Enter your 6 to 8 digit account number/);
    });

    it('does not pass the Bank Details page if sort code and account numbers too short', async () => {
      const URI = '/bank-details';
      await initSession(URI);
      await passStep(URI, {
        accountName: 'Mr Joe',
        sortCode: '11111',
        accountNumber: '22222',
        rollNumber: '12'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your sort code in the correct format; for example 010101/);
      expect(validationSummary.html())
        .to.match(/Enter your 6 to 8 digit account number/);
    });

    it('does not pass the Bank Details page if sort code and account numbers too long', async () => {
      const URI = '/bank-details';
      await initSession(URI);
      await passStep(URI, {
        accountName: 'Mr Joe',
        sortCode: '1111111',
        accountNumber: '222221111',
        rollNumber: '12'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter your sort code in the correct format; for example 010101/);
      expect(validationSummary.html())
        .to.match(/Enter your 6 to 8 digit account number/);
    });

    it('does pass the Bank Details page if account number 8 digits long', async () => {
      const URI = '/bank-details';
      await initSession(URI);
      await passStep(URI, {
        accountName: 'Mr Joe',
        sortCode: '111111',
        accountNumber: '22221111',
        rollNumber: '12'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });

    it('does pass the Bank Details page if roll not entered', async () => {
      const URI = '/bank-details';
      await initSession(URI);
      await passStep(URI, {
        accountName: 'Mr Joe',
        sortCode: '111111',
        accountNumber: '222222',
        rollNumber: ''
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
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
        .to.match(/Select how we can contact you/);
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
        .to.match(/Enter your email address/);
      expect(validationSummary.html())
        .to.match(/Enter your phone number in the correct format/);
    });
  });

  describe('Outcome Validations', () => {
    it('does not pass the Outcome page if nothing entered', async () => {
      const URI = '/outcome';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select if you are likely to move to another address in the next 4 weeks/);
    });

    it('does not pass the Outcome page if likelt to move entered with no details', async () => {
      const URI = '/outcome';
      await initSession(URI);
      await passStep(URI, {
        likelyToMove: 'yes'
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter details of the building and street/);
      expect(validationSummary.html())
        .to.match(/Enter a town or city/);
      expect(validationSummary.html())
        .to.match(/Enter a postcode/);
    });
  });

  describe('Help Validations', () => {
    it('does not pass the Help page if nothing entered', async () => {
      const URI = '/help';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select if you had any help making this application/);
    });
  });

  describe('Help Reasons Validations', () => {
    it('does not pass the Help Reasons page if nothing entered', async () => {
      const URI = '/help-reasons';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Select why you needed help/);
    });

    it('does pass the Help Reasons page if one item selected', async () => {
      const URI = '/help-reasons';
      await initSession(URI);
      await passStep(URI, {
        helpReasons: [
          'no_internet'
        ]
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });

    it('does pass the Help Reasons page if all items selected', async () => {
      const URI = '/help-reasons';
      await initSession(URI);
      await passStep(URI, {
        helpReasons: [
          'no_internet',
          'english_not_first_language',
          'not_confident',
          'faster',
          'health_condition'
        ]
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.false;
    });
  });

  describe('Who Helped Validations', () => {
    it('does not pass the Who Helped page if nothing entered', async () => {
      const URI = '/who-helped';
      await initSession(URI);
      await passStep(URI, {});

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter the full name of the person who helped you/);
      expect(validationSummary.html())
        .to.match(/Enter the person\'s relationship to you/);
      expect(validationSummary.html())
        .to.match(/Select how we can contact the person who helped you/);
    });

    it('does not pass the Who Helped page if email and phone details not entered', async () => {
      const URI = '/who-helped';
      await initSession(URI);
      await passStep(URI, {
        helpFullName: 'Uncle Bob',
        helpRelationship: 'Uncle',
        helpContactTypes: [
          'email',
          'phone'
        ]
      });

      const res = await getUrl(URI);
      const docu = await parseHtml(res);
      const validationSummary = docu.find('.validation-summary');

      expect(validationSummary.length === 1).to.be.true;
      expect(validationSummary.html())
        .to.match(/Enter the person\'s email address/);
      expect(validationSummary.html())
        .to.match(/Enter the person\'s phone number/);
    });
  });
});
