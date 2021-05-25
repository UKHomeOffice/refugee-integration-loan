/* eslint no-console: 0 */
const pa11y = require('pa11y');
const settings = require('../../../hof.settings.json');
const path = require('path');
const fs = require('fs');

describe('the journey of an accessible apply application', async () => {
  let testApp;
  let initSession;
  let getUrl;
  let uris = [];
  const accessibilityResults = [];

  const SUBAPP = 'apply';
  const URI = '/confirm';

  const codeExemptions = result => {
    const updatedResult = result;
    if (updatedResult.step === '/apply/ineligible') {
      const submitButtonCode = 'WCAG2AA.Principle3.Guideline3_2.3_2_2.H32.2';
      updatedResult.issues = updatedResult.issues.filter(obj => obj.code !== submitButtonCode);
    }
    return updatedResult;
  };

  before(async () => {
    settings.routes.map(route => {
      if (route.includes('apply')) {
        const routeConfig = require(path.resolve(process.cwd(), route));
        uris = uris.concat(Object.keys(routeConfig.steps));
      }
    });

    testApp = getSupertestApp(SUBAPP);
    initSession = testApp.initSession;
    getUrl = testApp.getUrl;
  });

  it('check apply accessibility issues', async () => {
    await initSession(URI);

    const exclusions = [
      '/other-names',
      '/partner-other-names',
      '/dependant-details',
      '/help-reasons',
      '/who-helped',
      '/complete'
    ];

    await uris.reduce(async (previous, uri) => {
      await previous;

      if (exclusions.includes(uri)) {
        const result = {
          step: `/${SUBAPP}${uri}`,
          generic_message: 'MANUAL CHECK REQUIRED'
        };
        console.log(result);
        return Promise.resolve();
      }

      const testHtmlFile = process.env.ENVIRONMENT === 'DRONE' ?
        `/root/.dockersock${uri}.html` :
        `${process.cwd()}/test/_accessibility/tmp${uri}.html`;

      const res = await getUrl(uri);

      await fs.writeFile(testHtmlFile, res.text, (err, success) => {
        if (err) return console.log(err);
        return success;
      });

      return pa11y(testHtmlFile, {
        chromeLaunchConfig: {
          args: ['--no-sandbox']
        }
      }).then(async r => {
        let result = r;

        result.step = `/${SUBAPP}${uri}`;

        result = codeExemptions(result);

        console.log(result);

        accessibilityResults.push(result);

        await fs.unlink(testHtmlFile, (err, success) => {
          if (err) return console.log(err);
          return success;
        });
      });
    }, Promise.resolve());

    accessibilityResults.forEach(result => {
      result.issues.should.be.empty;
    });
  }).timeout(300000);
});
