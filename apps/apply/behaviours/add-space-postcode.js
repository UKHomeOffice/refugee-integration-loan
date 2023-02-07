
module.exports = superclass => class extends superclass {
  process(req, res, next) {
    const postcodeArray = req.form.values.postcode.split('');
    if (req.form.values.postcode.length === 7) {
      postcodeArray.splice(4, 0, ' ');
      req.form.values.postcode = postcodeArray.join('');
    }
    if (req.form.values.postcode.length === 6) {
      postcodeArray.splice(3, 0, ' ');
      req.form.values.postcode = postcodeArray.join('');
    }
    if (req.form.values.postcode.length === 5) {
      postcodeArray.splice(2, 0, ' ');
      req.form.values.postcode = postcodeArray.join('');
    }
    super.process(req, res, next);
  }
};
