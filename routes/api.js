let async = require('async');
let router = require('express').Router();
let db = require('../DBhandler.js');
let auth = require('../auth.js');
let mailer = require('../email/mailer.js');
let validator = require('./inputvalidation.js');
let cfg = require('../config.js');

router.post('/register', validator.registration, function(req, res) {
  let data = validator.escapeHtml(req.body);

  // update DB entry with data from request
  // user is automatically removed from waitlist via sql trigger!
  db.insertUser(data, function(err) {

    if (err) return res.status(500).end('Fehler: ' + err);
    res.end('Erfolgreich angemeldet!');

    // send mail with confirmation mail
    mailer.sendRegistrationMail(data, function(err) {
      if (err) console.error('could not send registration mail:', err);
    });

    // send money exchange mails, if the user registered from a waitlist token
    mailer.sendMoneyTransfer(data.token, function(err) {
      if (err) console.error('could not send moneyexchange mail:', err);
    });
  });
});

router.post('/waitlist', validator.waitlist, function(req, res) {
  let data = validator.escapeHtml(req.body);
  db.insertWaitlist(data.email, function(err) {
    if (err) return res.status(400).end('Fehler: ' + err);
    res.end(data.email + ' erfolgreich zur Warteliste hinzugefügt.');
  });

});

router.post('/optout', validator.optout, function(req, res) {
  let data = validator.escapeHtml(req.body);
  db.optoutUser(data.token, data.email, function(err, newToken) {
    if (err) return res.end(err);
    res.end('Erfolgreich abgemeldet!');

    // send email to waitlist
    mailer.sendWaitlistNotification(newToken, function(err) {
      if (err) return console.error('could not send waitlist mail:', err);
      console.log('token ' + newToken + ' sent to waitlist!');
    });
  });
});

// return list of all registered users
router.get('/users/:year?', auth, function(req, res) {
  db.getUsers(req.params.year || cfg.year, function(err, users) {
    err ? res.status(501).send(err) : res.json(users);
  });
});

// return list of all users on waitlist
router.get('/waitlist/:year?', auth, function(req, res) {
  db.getWaitlist(req.params.year || cfg.year, function(err, waitlist) {
    err ? res.status(501).send(err) : res.json(waitlist);
  });
});

// generate [amount] new tokens
router.get('/generateTokens/:amount', auth, function(req, res) {
  db.createTokens(req.params.amount, function(err, tokens) {
    err ? res.status(501).send(err) : res.json(tokens);
  });
});

module.exports = router;
