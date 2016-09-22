var cfg = require('../config.js');
var async = require('async');
var nodemailer = require('nodemailer');
var cook = require('handlebars');
var fs = require('fs');
var kramed = require('kramed');

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
      cc: options.ccAddress,
      bcc: options.bccAddress,
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
    subject: 'Anmeldung zum Ersti-Wochenende ' + cfg.year,
    toAddress: userData.email
  }, callback);
};

exports.sendMoneyTransfer = function(newUserData, oldUserData, callback) {
  var locals = { oldUser: oldUserData, newUser: newUserData };

  var oldUserMail = {
    templateName: 'moneytransfer_olduser.md',
    templateLocals: locals,
    subject: 'Nachrücker für deinen Platz am Ersti-Wochenende ' + cfg.year,
    toAddress: oldUserData.email
  };

  var newUserMail = {
    templateName: 'moneytransfer_newuser.md',
    templateLocals: locals,
    subject: 'Teilnehmerbeitrag für das Ersti-Wochenende ' + cfg.year,
    toAddress: newUserData.email
  };

  async.parallel([
    async.apply(sendMail, oldUserMail),
    async.apply(sendMail, newUserMail)
  ], callback);
};

exports.sendWaitlistNotification = function(token, waitlist, timeout, callback) {
  setTimeout(function() {
    sendMail({
      templateName: 'waitlist_notification.md',
      templateLocals: { token: token },
      subject: 'Freier Platz fürs Ersti-Wochenende ' + cfg.year + '!',
      bccAddress: waitlist
    }, callback);
  }, timeout);
};
