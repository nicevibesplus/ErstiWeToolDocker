var db = require('../DBhandler.js');
var router = require('express').Router();
var auth = require('../auth.js');

router.post('/register', function(req, res) {
  db.insertUser(req.body, function(err) {

    if (err) {
      console.error(err);
      return res.status(400).end('Fehler: ' + err);
    }

    // TODO: send mail with confirmation request
    // TODO: extend sql schema with email tokens?
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

router.post('/optout', function(req, res) {
  console.log(req.body);
  // check if token:email pair is valid

  // db.dropUser(token);
  res.end('Erfolgreich abgemeldet!');
});

// return list of all registered users
router.get('/users', auth, function(req, res) {

});

// return list of all users on waitlist
router.get('/waitlist', auth, function(req, res) {

});

module.exports = router;
