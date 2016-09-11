var async = require('async');
var cfg = require('./config.js');
var mysql = require('mysql');

var pool = null;

/*
  Creates the Database Connection.
  @param {string} nodepsw - Password for the Database User nodejs_erstiwe
*/
exports.connect = function() {
  pool = mysql.createPool({
    connectionlimit: cfg.mysql_poolsize,
    host: cfg.mysql_host,
    user: cfg.mysql_user,
    password: cfg.mysql_pass,
    database: cfg.mysql_dbname
  });
};

/**
 * creates [amount] tokens for the year [year].
 * callback returns an array of generated tokens
 */
exports.createTokens = function(amount, callback) {
  var year = cfg.year;
  var tokens = [];
  var query = 'INSERT INTO users (token, year) VALUES (?, ?);';

  for (let i = 0; i < amount; i++)
    tokens[i] = Math.random().toString(36).substr(2,8);

  // insert at most [mysql_poolsize] tokens at once
  async.eachLimit(tokens, cfg.mysql_poolsize, function(token, cb) {
    pool.getConnection(function(err, conn) {
      if (err) return cb(err);
      conn.query(query, [token, year], function(err) {
        conn.release();
        cb(err);
      });
    });
  },
  function allDone(err) { callback(err, tokens); });
};

/*
  Checks if token is valid (e.g. token in users table & not used yet)
  Calls next() with parameter true if Operation was successful, false otherwise.
  @param {string} token - 8 Character long access token
*/
exports.checkToken = function(token, cb) {
  var query = 'SELECT COUNT(*) AS count FROM users WHERE token=? AND used=FALSE;';
  pool.getConnection(function(err,connection) {
    if (err) return cb(err);
    connection.query(query, [token], function(err, rows) {
      connection.release();
      if (err) return cb(err);
      rows[0].count ? cb(null, true) : cb(null, false);
    });
  });
};

/**
 * adds a user, if the provided token exists
 */
exports.insertUser = function(data, callback) {
  var insertQuery = 'UPDATE users SET email=?,firstname=?,lastname=?,gender=?,address=?,phone=?,birthday=?,study=?,food=?,info=?,used=? WHERE token=? AND year=? AND used=FALSE';
  var waitlistQuery = 'DELETE FROM waitlist WHERE email=? AND YEAR=?;';

  pool.getConnection(function(err, conn) {
    if (err) return callback(err);
    async.waterfall([
      // check if token is not used yet
      function(next) {
        exports.checkToken(data.token, next);
      },
      // insert new user
      function(validToken, next) {
        if (!validToken) return next('invalid token');
        conn.query(insertQuery, [
          data.email.substr(0,45),
          data.first_name.substr(0,45),
          data.last_name.substr(0,45),
          data.gender,
          [data.address, data.post_code, data.city].join(', ').substr(0,200),
          data.mobile.substr(0,20),
          data.birthday,
          data.study,
          data.veggie_level,
          data.comment.substr(0, 500),
          true,
          data.token,
          cfg.year
        ], function(err) { next(err); });
      },
      // remove from waitlist
      function(next) {
        conn.query(waitlistQuery, [data.email, cfg.year], next);
      }
    ], function allDone(err) {
      conn.release();
      callback(err);
    });
  });
};

exports.getUsers = function(callback) {
  // TODO
}

exports.getWaitlist = function(callback) {
  // TODO
};

exports.insertWaitlist = function(email, callback) {
  // TODO
};

exports.dropUser = function(token, callback) {
  // TODO: delete user

  exports.createTokens(1, callback);
}
