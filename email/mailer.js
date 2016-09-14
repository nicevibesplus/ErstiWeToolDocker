var cfg = require('../config.js');
var nodemailer = require('nodemailer');
var cook = require('handlebars');
var fs = require('fs');
var kramed = require('kramed');

cook.registerHelper('convert_food', function(food) {
  return food === 'any' ? 'nein' : 'ja';
});

cook.registerHelper('convert_study', function(study) {
  if (study === 'geoinf') return 'Geoinformatik';
  if (study === 'geo') return 'Geographie';
  if (study === 'loek') return 'Landschaftsökologie';
  if (study === 'zweifach') return 'Zweifach Bachelor';
});

/**
 * Sends an Email generated from the given options. Options have the following structure
 * { templateName, templateLocals, subject, toAddress }
 */
function sendMail(options, callback) {
  fs.readFile(__dirname + '/' + options.templateName, {encoding: 'utf-8'}, function (err, template) {
    if (err) return callback(err);

    var transporter = nodemailer.createTransport(cfg.mailer);
    var html = kramed(template);

    transporter.sendMail({
      to: options.toAddress,
      subject: options.subject,
      from: cfg.mailer.from,
      html: cook.compile(html)(options.templateLocals)
    }, callback);
  });
}

exports.sendRegistrationMail = function(userData, callback) {
  userData.dates = cfg.dates;
  sendMail({
    templateName: 'post_registration.md',
    templateLocals: userData,
    subject: 'Anmeldung zum Ersti-Wochenende',
    toAddress: userData.email
  }, callback);
};
