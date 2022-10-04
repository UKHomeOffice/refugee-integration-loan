const { salaryAmount } = require("../fields");
const _ = require('lodash')

module.exports = SuperClass => class extends SuperClass {
  process(req, res, next) {
    const min = 0.01;
    const formValues = req.form.values
    console.log("formValues: ", formValues)
    const values = Object.values(formValues)
    console.log("values", values)
    const keys = Object.keys(formValues)
    keys.forEach(item => {
      if (formValues[item].includes('£')) {
        console.log("formValues item", typeof formValues[item])
        formValues[item] = formValues[item].replace('£', '')
        console.log("formvalues after:  ", formValues[item])
      }
    })
    let numberWithoutPrefix
    //console.log("reqformvals: ",req.form.values)
    //console.log(req.form.options.fieldsConfig)
    // values.forEach(function(item) {
    //   if (item.indexOf('£') === 0) {
    //     return numberWithoutPrefix = item.replace('£', '')
    //     console.log("num without prefix", numberWithoutPrefix)
    //   } 
      //console.log(item)
      //console.log("numberWithoutPrefix inside map: ", numberWithoutPrefix)
    // })
    //console.log("numberWithoutPrefix: ", numberWithoutPrefix)
    //req.sessionModel.set('universalCreditAmount', numberWithoutPrefix);
    //console.log(v)
    //const field = Object.assign({},req.form.options.fields)

    console.log(req.form.values)
    //field.map(fields.attributes, item => console.log(item))
    //_.map(field, item => console.log("item", item))
     super.process(req, res, next);
     console.log("sessionmodel log", req.sessionModel.get('salaryAmount'))
  }
};

// const field = Object.assign({}, req.form.options.fields[key] || options.fields[key]);
// _.map(field.attributes, item => {if (item.prefix === '£') return item.replace '£', '';}),

