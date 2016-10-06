let validator = require('node-validator');
let sanitizeHtml = require('sanitize-html');

let checkRegistration = validator.isObject()
  .withRequired('token', validator.isString({regex: /^\S{8}$/}))
  .withRequired('email', validator.isString({regex: /^\S+@\S+$/}))
  .withRequired('firstname', validator.isString({regex: /^(?=.{1,50}$)[a-z]+$/}))
  .withRequired('lastname', validator.isString({regex: /^(?=.{1,50}$)[a-z]+$/}))
  .withRequired('birthday', validator.isString({regex: /^(?=.{1,50}$).+$/}))
  .withRequired('phone', validator.isString({regex: /^(?=.{1,50}$).+$/}))
  .withRequired('food', validator.isString({regex: /^(vegan|vegetarisch|fleischig)$/}))
  .withRequired('gender', validator.isString({regex: /^(male|female|other)$/}))
  .withRequired('study', validator.isString({regex: /^(Geoinformatik|Zwei-Fach-Bachelor|Geographie|Landschaftsökologie)$/}))
  .withOptional('comment');

let checkOptout = validator.isObject()
  .withRequired('token', validator.isString({regex: /^\S{8}$/}))
  .withRequired('email', validator.isString({regex: /^\S+@\S+$/}));

let checkWaitlist = validator.isObject()
  .withRequired('email', validator.isString({regex: /^\S+@\S+$/}));

let sanitizeUserInput = function(data) {
  Object.keys(data).forEach((key) => {
    let val = data[key];
    data[key] = sanitizeHtml(val);
  });
  return data;
}

module.exports = {
  escapeHtml: sanitizeUserInput,
  registration: validator.express(checkRegistration),
  waitlist: validator.express(checkWaitlist),
  optout: validator.express(checkOptout)
};
