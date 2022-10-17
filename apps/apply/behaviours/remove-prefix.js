
module.exports = SuperClass => class extends SuperClass {
  process(req, res, next) {
    const formValues = req.form.values;
    const keys = Object.keys(formValues);
    keys.forEach(item => {
      while (formValues[item].includes('£')) {
        formValues[item] = formValues[item].replace('£', '');
      }
    });
    super.process(req, res, next);
  }
};
