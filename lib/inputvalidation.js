const validator = require('node-validator');
const sanitizeHtml = require('sanitize-html');

const checkRegistration = validator.isObject()
  .withRequired('token', validator.isString({
    regex: /^\S{8}$/,
    message: 'token musst be aplhanumeric and 8 characters.'
  }))
  .withRequired('email', validator.isString({
    regex: /^(?=.{1,50}$)\S+@\S+$/,
    message: 'invalid email, must be shorter than 50 characters.'
  }))
  .withRequired('firstname', validator.isString({
    regex: /^(?=.{1,50}$).+$/,
    message: 'firstname must be shorter than 50 characters.'
  }))
  .withRequired('lastname', validator.isString({
    regex: /^(?=.{1,50}$).+$/,
    message: 'lastname must be shorter than 50 characters.'
  }))
  .withRequired('birthday', validator.isString({
    regex: /^(?=.{1,50}$).+$/,
    message: 'birthday must be shorter than 50 characters.'
  }))
  .withRequired('phone', validator.isString({
    regex: /^(?=.{1,50}$).+$/,
    message: 'phone must be shorter than 50 characters.'
  }))
  .withRequired('food', validator.isString({
    regex: /^(vegan|vegetarisch|fleischig)$/,
    message: 'invalid value for food (one of vegan, vegetarisch, fleischig).'
  }))
  .withRequired('gender', validator.isString({
    regex: /^(male|female|other)$/,
    message: 'invalid value for gender (one of male, female, other).'
  }))
  .withRequired('study', validator.isString({
    regex: /^(Geoinformatik|Zwei-Fach-Bachelor|Geographie|Landschaftsökologie)$/,
    message: 'invalid value for study (one of Geoinformatik, Zwei-Fach-Bachelor, Geographie, Landschaftsökologie).'
  }))
  .withOptional('comment');

const checkOptout = validator.isObject()
  .withRequired('token', validator.isString({
    regex: /^\S{8}$/,
    message: 'token musst be aplhanumeric and 8 characters.'
  }))
  .withRequired('email', validator.isString({
    regex: /^\S+@\S+$/,
    message: 'invalid email, must be shorter than 50 characters.'}
  ));

const checkWaitlist = validator.isObject()
  .withRequired('email', validator.isString({
    regex: /^\S+@\S+$/,
    message: 'invalid email, must be shorter than 50 characters.'}
  ));

const sanitizeUserInput = function(data) {
  Object.keys(data).forEach((key) => {
    const val = data[key];
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
