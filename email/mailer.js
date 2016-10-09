var cfg = require('../config.js');
var db = require('../DBhandler.js');
var async = require('async');
var nodemailer = require('nodemailer');
var cook = require('handlebars');
var fs = require('fs');
var kramed = require('kramed');
var moment = require('moment');
moment.locale('de');

cook.registerHelper('dateFormat', (date, format) => moment(date).format(format));

/**
 * Sends an Email generated from the given options. Options have the following structure
 * { templateName, templateLocals, subject, toAddress }
 */
function sendMail(options, callback) {
  fs.readFile(__dirname + '/' + options.templateName, {encoding: 'utf-8'}, function (err, template) {
    if (err) return callback(err);

    var transporter = nodemailer.createTransport(cfg.mailer);
    var markdown = cook.compile(template)(options.templateLocals);

    transporter.sendMail({
      to: options.toAddress,
      cc: options.ccAddress,
      bcc: options.bccAddress,
      subject: options.subject,
      from: cfg.mailer.from,
      html: kramed(markdown)
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
    locals.attendee_cost = cfg.attendee_cost;

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
  // send the mail randomly in the next 30min-24h
  let timeout = randomTimeout(0.5, 24);

  setTimeout(function() {
    db.getWaitlist(cfg.year, function(err, waitlist) {
      if (err) return callback('error getting waitlist: ', err);

      sendMail({
        templateName: 'waitlist_notification.md',
        templateLocals: { token: token },
        subject: 'Freier Platz für das Ersti-Wochenende ' + cfg.year + '!',
        bccAddress: waitlist.map(el => el.email).join(',') // BCC for privacy
      }, callback);
    });
  }, timeout);
};

function randomTimeout(min, max) {
  const weDate = new Date(cfg.dates.begin);
  const now = new Date();
  // exception: is the event closer than 24h? -> send instantly
  if (weDate - now < 1000*3600*24) return 0;

  let timeout = Math.random() * (max - min);
  timeout = Math.floor((timeout + min) * 3600000); // scale hours to millisec
  const scheduled = new Date(now.getTime() + timeout);
  console.log(scheduled);

  // resulting date is not at night?
  if (scheduled.getHours() < 22 && scheduled.getHours() > 9)
    return timeout;
  else
    return randomTimeout(min, max);
}
