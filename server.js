
const hof = require('hof');
const config = require('./config');
const _ = require('lodash');
const path = require('path');

let settings = require('./hof.settings');

settings = Object.assign({}, settings, {
  behaviours: settings.behaviours.map(require),
  routes: settings.routes.map(require),
  views: settings.views.map(view => path.resolve(__dirname, view)),
  getTerms: false,
  getCookies: false
});

const app = hof(settings);

// Terms & Cookies added to have visibility on accessibility statement
// in the footer. Once HOF has updated with that we can remove these
// including the getTerms: false, getCookies: false config
app.use('/terms-and-conditions', (req, res, next) => {
  res.locals = Object.assign({}, res.locals, req.translate('terms'));
  next();
});

app.use('/cookies', (req, res, next) => {
  res.locals = Object.assign({}, res.locals, req.translate('cookies'));
  next();
});

app.use((req, res, next) => {
  res.locals.htmlLang = 'en';
  res.locals.feedbackUrl = '/feedback';
  res.locals.footerSupportLinks = [
    { path: '/cookies', property: 'base.cookies' },
    { path: '/terms-and-conditions', property: 'base.terms' },
    { path: '/accessibility', property: 'base.accessibility' },
    { path: '/improve-our-services', property: 'base.improve-our-services' }
  ];
  next();
});

if (config.nodeEnv === 'development' || config.nodeEnv === 'test') {
  app.use('/test/bootstrap-session', (req, res) => {
    const appName = req.body.appName;

    if (!_.get(req, 'session[`hof-wizard-${appName}`]')) {
      if (!req.session) {
        throw new Error('Redis is not running!');
      }

      req.session[`hof-wizard-${appName}`] = {};
    }

    Object.keys(req.body.sessionProperties || {}).forEach(key => {
      req.session[`hof-wizard-${appName}`][key] = req.body.sessionProperties[key];
    });

    res.send('Session populate complete');
  });
}


module.exports = app;
