/* eslint no-console: 0 */
const pa11y = require('pa11y');
const settings = require('../../../hof.settings');
const path = require('path');
const fs = require('fs');

describe('the journey of an accessible accept application', async () => {
  let testApp;
  let initSession;
  let getUrl;
  let uris = [];
  const accessibilityResults = [];

  const SUBAPP = 'accept';
  const URI = '/contact';

  before(async () => {
    settings.routes.map(route => {
      if (route.includes('accept')) {
        const routeConfig = require(path.resolve(process.cwd(), route));
        uris = uris.concat(Object.keys(routeConfig.steps));
      }
    });

    testApp = getSupertestApp(SUBAPP);
    initSession = testApp.initSession;
    getUrl = testApp.getUrl;
  });

  it('check accept accessibility issues', async () => {
    await initSession(URI);

    const exclusions = [
      '/confirm',
      '/complete-acceptance'
    ];

    await uris.reduce(async (previous, uri) => {
      await previous;
      console.log(uri);
      if (exclusions.includes(uri)) {
        return Promise.resolve();
      }

      const testHtmlFile = process.env.ENVIRONMENT === 'DRONE' ?
        `/root/.dockersock${uri}.html` :
        `${process.cwd()}/test/_integration/tmp${uri}.html`;

      const res = await getUrl(uri);

      await fs.writeFile(testHtmlFile, res.text, (err, success) => {
        if (err) return console.log(err);
        return success;
      });

      return pa11y(testHtmlFile, {
        chromeLaunchConfig: {
          args: ['--no-sandbox']
        }
      }).then(async results => {
        results.step = `/${SUBAPP}${uri}`;
        console.log(results);
        accessibilityResults.push(results);

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
