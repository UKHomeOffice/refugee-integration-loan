'use strict';

describe('the journey of a single apply application', () => {

  let testApp;
  let getUrl;
  let initSession;
  let getDom;
  let parseHtml;
  let getSectionHeaderByText = (document, text) => {
    const headers = document.querySelectorAll('h3.section-header');

    return Array(headers.length)
      .fill().map((_, i) => headers[i].textContent).find(header => header.match(text));
  };

  const SUBAPP = 'apply';

  describe('summary with no aggregated fields', () => {
    before(function setup() {
      testApp = getSupertestApp(SUBAPP);
      getUrl = testApp.getUrl;
      parseHtml = testApp.parseHtml;
      getDom = testApp.getDom;
      initSession = testApp.initSession;
    });

    it('should show the summary page', async() => {
      const URI = '/confirm';
      await initSession(URI);
      const res = await getUrl(URI);
      const docu = await parseHtml(res);

      const header = docu.find('header h1');

      header.html().should.match(/Check your answers before sending your application/);
    });

    it('should show the has other names section', async() => {
      const URI = '/confirm';
      await initSession(URI);
      const res = await getUrl(URI);
      const docu = await getDom(res);

      const header = getSectionHeaderByText(docu, /Have you been known by any other names?/);

      expect(header).to.not.be.undefined;
    });

    it('should show the has dependants living with you section', async() => {
      const URI = '/confirm';
      await initSession(URI);
      const res = await getUrl(URI);
      const docu = await getDom(res);

      const header = getSectionHeaderByText(docu, /Do you have any dependants living with you?/);

      expect(header).to.not.be.undefined;
    });

    it('should not show the other names section if has other names is false', async() => {
      const URI = '/confirm';
      await initSession(URI);
      const res = await getUrl(URI);
      const docu = await getDom(res);

      const header = getSectionHeaderByText(docu, /Other names/);

      expect(header).to.be.undefined;
    });

    it('should not show the partner other names section if the applicant\'s partner has no other names', async() => {
      const URI = '/confirm';
      await initSession(URI);

      const res = await getUrl(URI);
      const docu = await getDom(res);

      const header = getSectionHeaderByText(docu, /Partner's other names/);

      expect(header).to.be.undefined;
    });

    it('should show your dependant details section if the applicant has no other dependants', async() => {
      const URI = '/confirm';
      await initSession(URI);

      const res = await getUrl(URI);
      const docu = await getDom(res);

      const header = getSectionHeaderByText(docu, /Your dependants/);

      expect(header).to.be.undefined;
    });
  });

  describe('summary with aggregated fields', () => {
    before(function setup() {
      testApp = getSupertestApp(SUBAPP, SUBAPP, 'pages-with-aggregate-fields');
      getUrl = testApp.getUrl;
      parseHtml = testApp.parseHtml;
      getDom = testApp.getDom;
      initSession = testApp.initSession;
    });


    it('should show the other names section if the applicant has other names', async() => {
      const URI = '/confirm';
      await initSession(URI);

      const res = await getUrl(URI);
      const docu = await getDom(res);

      const header = getSectionHeaderByText(docu, /Other names/);

      expect(header).to.not.be.undefined;
    });

    it('should show the partner other names section if the applicant\'s partner has other names', async() => {
      const URI = '/confirm';
      await initSession(URI);

      const res = await getUrl(URI);
      const docu = await getDom(res);

      const header = getSectionHeaderByText(docu, /Partner's other names/);

      expect(header).to.not.be.undefined;
    });

    it('should show your dependant details section if the applicant has other dependants', async() => {
      const URI = '/confirm';
      await initSession(URI);

      const res = await getUrl(URI);
      const docu = await getDom(res);

      const header = getSectionHeaderByText(docu, /Your dependants/);

      expect(header).to.not.be.undefined;
    });
  });
});
