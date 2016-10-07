let async = require('async');
let router = require('express').Router();
let db = require('../DBhandler.js');
let auth = require('../auth.js');
let mailer = require('../email/mailer.js');
let validator = require('./inputvalidation.js');
let cfg = require('../config.js');
let fs = require('fs');

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

// return list of all registered users as downloadable File
router.get('/download/users/:year?', auth, function(req, res) {
  db.getRegulars(req.params.year || cfg.year, function(err, users) {
    if(err){res.status(501).send(err)}
    else{
      var filename = "/tmp/erstiwe" + cfg.year + "-users.csv";
      fs.unlink(filename, function(){
          createCSVfile_users(users,filename, function(filename){
            res.setHeader('Content-disposition', 'attachment; filename=Erstiwochende-Teilnehmer.csv');
            res.setHeader('Content-type', 'text/csv');
            fs.createReadStream(filename).pipe(res);
      })});  
    };
  });
});

// return list of all users on waitlist as downloadable File
router.get('/download/waitlist/:year?', auth, function(req, res) {
  db.getWaitlist(req.params.year || cfg.year, function(err, waitlist) {
        if(err){res.status(501).send(err)}
    else{
      var filename = "/tmp/erstiwe" + cfg.year + "-waitinglist.csv";
      fs.unlink(filename, function(){
          createCSVfile_waitlist(waitlist,filename, function(filename){
            res.setHeader('Content-disposition', 'attachment; filename=Erstiwochende-Warteliste.csv');
            res.setHeader('Content-type', 'text/csv');
            fs.createReadStream(filename).pipe(res);
      })});  
    };
  });
});

// return list of all waitings now attending [Nachruecker] as downloadable File
router.get('/download/successor/:year?', auth, function(req, res) {
  db.getSuccessors(req.params.year || cfg.year, function(err, successors) {
        if(err){res.status(501).send(err)}
    else{
      var filename = "/tmp/erstiwe" + cfg.year + "-successors.csv";
      fs.unlink(filename, function(){
          createCSVfile_users(successors,filename, function(filename){
            res.setHeader('Content-disposition', 'attachment; filename=Erstiwochende-Nachruecker.csv');
            res.setHeader('Content-type', 'text/csv');
            fs.createReadStream(filename).pipe(res);
      })});  
    };
  });
});

// return list of all unsused Token as downloadable File
router.get('/download/token/:year?', auth, function(req, res) {
  db.getUnusedToken(req.params.year || cfg.year, function(err, tokens) {
        if(err){res.status(501).send(err)}
    else{
      var filename12 = "/tmp/erstiwe" + cfg.year + "-tokens.csv";
      fs.unlink(filename12, function(){
            createCSVfile_token(tokens, filename12, function(filename){
              res.setHeader('Content-disposition', 'attachment; filename=Erstiwochende-Tokens.csv');
              res.setHeader('Content-type', 'text/csv');
              fs.createReadStream(filename12).pipe(res);
      })});  
    };
  });
});

// return Number of Attendees
router.get('/statistics', auth, function(req, res) {
  db.countAttendants(req.params.year || cfg.year, function(err, attendants) {
    db.countWaiting(req.params.year || cfg.year, function(err, waiting) {
      if(err){res.status(501).send(err)}
      else{res.end(
        "Momentan angemeldete Teilnehmer: " + 
        JSON.stringify(attendants) + 
        "Momentan auf der Warteliste: " + 
        JSON.stringify(waiting)
      )};
    });
  });
});

// Parsing the MYSQL Row Data to CSV format
function createCSVfile_token(tokens, filename,cb){
  tokens.forEach(tokens => fs.appendFile(filename,
                                                JSON.stringify(tokens.token) + "\n"));
  cb(filename);
}

// Parsing the MYSQL Row Data to CSV format
function createCSVfile_waitlist(waitlist, filename,cb){
  waitlist.forEach(waitlist => fs.appendFile(filename,
                                                JSON.stringify(waitlist.email) + "," + 
                                                JSON.stringify(waitlist.year) + "," +  
                                                JSON.stringify(waitlist.timestamp)+ "\n"));
  cb(filename);
}

// Parsing the MYSQL Row Data to CSV format
function createCSVfile_users(users, filename,cb){
  users.forEach(users => fs.appendFileSync(filename,
                                                JSON.stringify(users.firstname) + "," + 
                                                JSON.stringify(users.lastname)  + "," + 
                                                JSON.stringify(users.gender)     + "," +
                                                JSON.stringify(users.email)       + "," + 
                                                JSON.stringify(users.phone)      + "," + 
                                                JSON.stringify(users.food)        + "," +
                                                JSON.stringify(users.comment)  + "," +
                                                JSON.stringify(users.study)        + "\n"));
  cb(filename);
}

// generate [amount] new tokens
router.get('/generateTokens/:amount', auth, function(req, res) {
  db.createTokens(req.params.amount, function(err, tokens) {
     if(err){res.status(501).send(err)}else{res.sendStatus(200)}
  });
});

module.exports = router;
