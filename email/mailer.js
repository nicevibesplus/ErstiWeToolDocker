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

// will contain moment()s of scheduled waitlist notifications for API
exports.waitlistSchedule = [];

// send the mail randomly in the next 30min-24h
exports.scheduleWaitlistNotification = function(token, callback) {
  const scheduledAt = randomTimeout(0.5, 24);
  exports.waitlistSchedule.push(scheduledAt);

  setTimeout(function() {
    db.getWaitlist(cfg.year, function(err, waitlist) {
      // delete all scheduled times that have passed (eg the one we are currently handling)
      exports.waitlistSchedule = exports.waitlistSchedule
        .filter(time => (moment().diff(time) <= 0));

      if (err) return callback('error getting waitlist: ', err);

      sendMail({
        templateName: 'waitlist_notification.md',
        templateLocals: { token: token },
        subject: 'Freier Platz für das Ersti-Wochenende ' + cfg.year + '!',
        bccAddress: waitlist.map(el => el.email).join(',') // BCC for privacy
      }, callback);
    });
  }, scheduledAt.diff(moment())); // get milliseconds from now on
};

// returns a moment() of the scheduled time,
// which is min-max hours in the future.
function randomTimeout(min, max) {
  let eventDate = moment(cfg.dates.begin);
  let now = moment();

  // exception: is the event closer than 40h? -> send after 30min
  if (eventDate.diff(now, 'h', true) < 40)
    return now.add(30, 'm');

  let timeout = Math.random() * (max - min);
  timeout = Math.floor((timeout + min) * 3600000); // scale hours to millisec
  const scheduled = now.add(timeout, 'ms');

  // resulting date is not at night?
  if (scheduled.hour() < 22 && scheduled.hour() > 9)
    return scheduled;
  else
    return randomTimeout(min, max);
}
