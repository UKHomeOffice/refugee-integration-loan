
const reqres = require('reqres');
const Model = require('hof-model');

module.exports = options => {
  const opts = options || {};
  const req = reqres.req(opts);
  req.log = () => {};
  req.form = req.form || {};
  req.form.values = req.form.values || {};
  req.sessionModel = new Model(opts.session);
  req.translate = key => key;
  return req;
};
