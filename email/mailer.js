var cfg = require('../config.js');
var db = require('../DBhandler.js');
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

exports.sendMoneyTransfer = function(newToken, callback) {
  var locals = {}, newUserMail, oldUserMail;
  db.getUsers(cfg.year, function(err, users) {
    if (err) return callback('error getting users: ' + err);
    locals.newUser = users.find(el => (el.token === newToken));

    // no need to send the mails if prev_user is undefined
    if (!locals.newUser['prev_user']) return callback(null);

    locals.oldUser = users.find(el => (el.token === locals.newUser['prev_user']));

    oldUserMail = {
      templateName: 'moneytransfer_olduser.md',
      templateLocals: locals,
      subject: 'Nachrücker für deinen Platz am Ersti-Wochenende ' + cfg.year,
      toAddress: locals.oldUser.email
    };

    newUserMail = {
      templateName: 'moneytransfer_newuser.md',
      templateLocals: locals,
      subject: 'Teilnehmerbeitrag für das Ersti-Wochenende ' + cfg.year,
      toAddress: locals.newUser.email
    };

    async.parallel([
      async.apply(sendMail, oldUserMail),
      async.apply(sendMail, newUserMail)
    ], callback);
  });
};

exports.sendWaitlistNotification = function(token, callback) {
  var timeout = Math.random() * (cfg.waitlistDelay.max - cfg.waitlistDelay.min);
  timeout = Math.floor((timeout + cfg.waitlistDelay.min) * 60000); // scale minutes to millisec

  db.getWaitlist(cfg.year, function(err, waitlist) {
    if (err) return callback('error getting waitlist: ', err);

    // create string from waitlist
    waitlist = waitlist.map(el => el.email).join(',');

    setTimeout(function() {
      sendMail({
        templateName: 'waitlist_notification.md',
        templateLocals: { token: token },
        subject: 'Freier Platz für das Ersti-Wochenende ' + cfg.year + '!',
        bccAddress: waitlist // BCC for privacy
      }, callback);
    }, timeout);
  });
};
