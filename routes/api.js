var async = require('async');
var router = require('express').Router();
var db = require('../DBhandler.js');
var auth = require('../auth.js');
var cfg = require('../config.js');

router.post('/register', function(req, res) {
  db.insertUser(req.body, function(err) {

    if (err) {
      console.error(err);
      return res.status(400).end('Fehler: ' + err);
    }

    // TODO: send mail with confirmation request & hint to previous user
    res.end('Erfolgreich angemeldet!');
  });
});

router.post('/waitlist', function(req, res) {
  db.insertWaitlist(req.body.email, function(err) {
    if (err) {
      console.error(err);
      return res.status(400).end('Fehler: ' + err);
    }
    res.end(req.body.email + ' erfolgreich zur Warteliste hinzugefügt.');
  });

});

// TODO: send email to waitlist
router.post('/optout', function(req, res) {
  async.waterfall([
    // check if token:email pair is valid first
    async.apply(db.checkTokenEmail, req.body.token, req.body.email),
    function(valid, next) {
      if (!valid) return next('Email passt nicht zu Token!');
      db.optoutUser(req.body.token, next);
    }
  ], function(err) {
    if (err)
      res.send(err);
    else
      res.send('Erfolgreich abgemeldet!');
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

module.exports = router;
