let async = require('async');
let router = require('express').Router();
let db = require('../DBhandler.js');
let auth = require('../auth.js');
let mailer = require('../email/mailer.js');
let validator = require('./inputvalidation.js');
let cfg = require('../config.js');
let csv = require('to-csv');

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
    if (err) return res.status(501).end('Fehler: ' + err);
    res.end(data.email + ' erfolgreich zur Warteliste hinzugefügt.');
  });
});

router.post('/optout', validator.optout, function(req, res) {
  let data = validator.escapeHtml(req.body);
  db.optoutUser(data.token, data.email, function(err, newToken) {
    if (err) return res.status(403).end(err);
    res.end('Erfolgreich abgemeldet!');

    // send email to waitlist
    mailer.sendWaitlistNotification(newToken, function(err) {
      if (err) return console.error('could not send waitlist mail:', err);
      console.log('token ' + newToken + ' sent to waitlist!');
    });
  });
});

// require basic authentication on all following routes
router.use(auth);

// return list of all users on waitlist as downloadable File
router.get('/waitlist', function(req, res) {
  db.getWaitlist(req.query.year || cfg.year, function(err, waitlist) {
    if (err) return res.status(501).end(err);
    handleResponse(req, res, waitlist);
  });
});

// return list of all users, including unused tokens
router.get('/users', function(req, res) {
  db.getUsers(req.query.year || cfg.year, function(err, users) {
    if (err) return res.status(501).end(err);
    handleResponse(req, res, users);
  });
});

// return list of attending users
router.get('/users/attending', function(req, res) {
  db.getAttendees(req.query.year || cfg.year, function(err, users) {
    if (err) return res.status(501).end(err);
    handleResponse(req, res, users);
  });
});

// return list of nachrückers
router.get('/users/from-waitlist', function(req, res) {
  db.getSuccessors(req.query.year || cfg.year, function(err, users) {
    if (err) return res.status(501).end(err);
    handleResponse(req, res, users);
  });
});

// return list of users that have opted out
router.get('/users/opted-out', function(req, res) {
  db.getOptouts(req.query.year || cfg.year, function(err, users) {
    if (err) return res.status(501).end(err);
    handleResponse(req, res, users);
  });
});

// return list of users that have opted out
router.get('/users/regular', function(req, res) {
  db.getRegulars(req.query.year || cfg.year, function(err, users) {
    if (err) return res.status(501).end(err);
    handleResponse(req, res, users);
  });
});

// return Number of Attendees
router.get('/statistics', function(req, res) {
  db.getCounts(req.params.year || cfg.year, function(err, counts) {
    if (err) return res.status(501).end(err);
    handleResponse(req, res, counts);
  });
});

// generate [amount] new tokens
router.get('/generateTokens/:amount', function(req, res) {
  db.createTokens(req.params.amount, function(err, tokens) {
    if (err) return res.status(501).end(err);
    handleResponse(req, res, tokens);
  });
});

function handleResponse(req, res, data) {
  const format = req.query.format || 'json';
  // add download headers to any response,
  // if the param "download" is present in the query
  if (req.query.download !== undefined) {
    res.append('Content-Disposition', 'attachment');
    res.append('filename', req.path + '.' + format);
  }

  // convert to csv if format=csv is present in the query
  if (format === 'csv') {
    if (!data.length) data.push({'empty': 'no data'});
    res.append('Content-Type', 'text/csv').send(csv(data));
  } else {
    res.json(data);
  }
}

module.exports = router;
