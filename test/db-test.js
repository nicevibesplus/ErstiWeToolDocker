var async = require('async');
var db = require('../DBhandler.js');
var cfg = require('../config.js');

var userData = {
  email: 'asdf@asdf.de',
  first_name: 'Heinz',
  last_name: 'Kjuni',
  gender: 'male',
  address: 'Plksdflkjdsf',
  post_code: 9879,
  city: 'Aachen',
  mobile: '09823487345',
  birthday: '1994-04-02',
  study: 'gi',
  veggie_level: 'vegan',
  comment: ''
};

db.connect();

db.createTokens(10, function(err, tokens) {
  if (err) console.error(err);
  console.log(tokens);

  db.checkToken(tokens[0], function(err, valid) {
    if (err) console.error(err);
    console.log('valid token: ' + valid);
  });
  db.insertUser(userData, tokens[0], function(err) {
    if (err) console.log(err);
    db.checkToken(tokens[0], function(err, valid) {
      if (err) console.error(err);
      console.log('valid token post insert: ' + valid);
      process.exit()
    });
  });
});
