var async = require('async');
var db = require('../DBhandler.js');
var cfg = require('../config.js');

var userData = {
  email: Math.random().toString(36).substr(2,6) + '@asdf.de',
  first_name: 'Heinz',
  last_name: 'Kjuni',
  gender: 'male',
  address: 'Plksdflkjdsf',
  post_code: 9879,
  city: 'Aachen',
  mobile: '09823487345',
  birthday: '1994-04-02',
  study: 'geoinf',
  veggie_level: 'vegan',
  comment: ''
};

db.connect();

async.waterfall([
  async.apply(db.insertWaitlist, userData.email),
  async.apply(db.createTokens, 1),
  function(tokens, next) {
    console.log(tokens);
    userData.token = tokens[0].register;
    db.checkToken(tokens[0].register, next);
  },
  function(valid, next) {
    console.log('token check should pass. token valid = ', valid);
    db.insertUser(userData, next);
  },
  async.apply(db.getUsers, cfg.year),
  function(users, next) {
    console.log(users);
    db.insertUser(userData, next);
  }
], function(err) {
  console.error('should throw error: ' + err);
  process.exit();
});
