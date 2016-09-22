var async = require('async');
var router = require('express').Router();
var db = require('../DBhandler.js');
var auth = require('../auth.js');
var mailer = require('../email/mailer.js');
var cfg = require('../config.js');

// TODO: refactor using async auto?
router.post('/register', function(req, res) {
  db.insertUser(req.body, function(err) {

    if (err) return res.status(500).end('Fehler: ' + err);
    res.end('Erfolgreich angemeldet!');

    // send mail with confirmation mail
    mailer.sendRegistrationMail(req.body, function(err) {
      if (err) console.error('could not send registration mail:', err);
    });

    // send money exchange mails, if the user registered from a waitlist token
    // user is automatically removed from waitlist via sql trigger!
    db.getUsers(cfg.year, function(err, users) {
      if (err) return console.error('error getting users: ' + err);
      var newUser = users.find(el => (el.token === req.body.token));
      if (!newUser['prev_user']) return;

      var oldUser = users.find(el => (el.token === newUser['prev_user']));
      mailer.sendMoneyTransfer(newUser, oldUser, function(err) {
        if (err) console.error('could not send moneyexchange mail:', err);
      });
    });

  });
});

router.post('/waitlist', function(req, res) {
  db.insertWaitlist(req.body.email, function(err) {
    if (err) return res.status(400).end('Fehler: ' + err);
    res.end(req.body.email + ' erfolgreich zur Warteliste hinzugefügt.');
  });

});

router.post('/optout', function(req, res) {
  async.waterfall([
    // check if token:email pair is valid first
    async.apply(db.checkTokenEmail, req.body.token, req.body.email),
    function(valid, next) {
      if (!valid) return next('Email passt nicht zu Token!');
      db.optoutUser(req.body.token, next);
    }
  ], function(err, newToken) {
    if (err) return res.end(err);
    res.end('Erfolgreich abgemeldet!');

    // send email to waitlist
    db.getWaitlist(cfg.year, function(err, waitlist) {
      if (err) return console.error('error getting prev_user: ' + err);

      waitlist = waitlist.map(el => el.email).join(',');

      var timeout = 10000; // TODO: random value!
      mailer.sendWaitlistNotification(newToken, waitlist, timeout, function(err) {
        if (err) return console.error('could not send waitlist mail:', err);
        console.log('token ' + newToken + ' sent to waitlist!');
      });
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
