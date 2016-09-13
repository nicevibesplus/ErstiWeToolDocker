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
 * creates [amount] tokens for the current year
 * callback returns an array of generated tokens
 */
exports.createTokens = function(amount, callback) {
  var year = cfg.year;
  var tokens = [];
  var query = 'INSERT INTO users (token, emailtoken, year) VALUES (?, ?, ?);';

  for (let i = 0; i < amount; i++) {
    tokens[i] = {
      register: Math.random().toString(36).substr(2,8),
      email: Math.random().toString(36).substr(2,8)
    };
  }

  // insert at most [mysql_poolsize] tokens at once
  async.eachLimit(tokens, cfg.mysql_poolsize, function(t, cb) {
    pool.getConnection(function(err, conn) {
      if (err) return cb(err);
      conn.query(query, [t.register, t.email, year], function(err) {
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
  var query = 'SELECT COUNT(*) AS count FROM users WHERE token=? AND state=\'free\';';
  pool.getConnection(function(err, conn) {
    if (err) return cb(err);
    conn.query(query, [token], function(err, rows) {
      conn.release();
      if (err) return cb(err);
      rows[0].count ? cb(null, true) : cb(null, false);
    });
  });
};

/*
  Checks if a token:email pair is valid
  Calls next() with parameter true if Operation was successful, false otherwise.
  @param {string} token - 8 Character long access token
*/
exports.checkTokenEmail = function(token, email, cb) {
  var query = 'SELECT COUNT(*) AS count FROM users WHERE token=? AND email=?;';
  pool.getConnection(function(err, conn) {
    if (err) return cb(err);
    conn.query(query, [token, email], function(err, rows) {
      conn.release();
      if (err) return cb(err);
      rows[0].count ? cb(null, true) : cb(null, false);
    });
  });
};

/**
 * adds a user, if the provided token exists
 */
exports.insertUser = function(data, callback) {
  var query = 'UPDATE users SET email=?,firstname=?,lastname=?,gender=?,address=?,phone=?,birthday=?,study=?,food=?,info=?,state=\'registered\' WHERE token=? AND year=?;';

  pool.getConnection(function(err, conn) {
    // validate token
    exports.checkToken(data.token, function(err, validToken) {
      // insert new user
      if (err) return callback(err);
      if (!validToken) return callback('invalid token');

      conn.query(query, [
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
        data.token,
        cfg.year
      ], function(err) {
        conn.release();
        callback(err);
      });
    });
  });
};

exports.getUsers = function(year, callback) {
  var query = 'SELECT * FROM users WHERE year=?;';
  pool.getConnection(function(err, conn) {
    if (err) return callback (err);
    conn.query(query, [year], function(err, rows) {
      conn.release();
      callback(err, rows);
    });
  });
}

exports.getWaitlist = function(year, callback) {
  var query = 'SELECT * FROM waitlist WHERE year=?;';
  pool.getConnection(function(err, conn) {
    if (err) return callback (err);
    conn.query(query, [year], function(err, rows) {
      conn.release();
      callback(err, rows);
    });
  });
};

exports.insertWaitlist = function(email, callback) {
  var query = 'REPLACE INTO waitlist (email, year) VALUES (?, ?);';
  pool.getConnection(function(err, conn) {
    if (err) return callback (err);
    conn.query(query, [email, cfg.year], function(err) {
      conn.release();
      callback(err);
    });
  });
};

exports.optoutUser = function(token, callback) {
  var optoutQuery = 'UPDATE users SET state=\'opted_out\' WHERE token=? AND year=?;';
  var addRefQuery = 'UPDATE users SET prev_user=? WHERE token=? AND year=?;';

  pool.getConnection(function(err, conn) {
    if (err) return callback (err);
    async.waterfall([
      // mark user opted out
      function(next) {
        conn.query(optoutQuery, [token, cfg.year], next);
      },
      // create new token
      function(result, asdf, next) {
        exports.createTokens(1, next);
      },
      // add reference to previous user to new user
      function(tokens, next) {
        conn.query(addRefQuery, [token, tokens[0].register, cfg.year], next);
      }
    ], function allDone(err) {
      conn.release();
      callback(err);
    });
  });
};

exports.countAttendants = function(year) {
  var query = 'SELECT COUNT(*) AS count FROM users WHERE year=? AND state=\'registered\';';
  pool.getConnection(function(err, conn) {
    if (err) return callback (err);
    conn.query(query, [year || cfg.year], function(err, rows) {
      conn.release();
      callback(err, rows[0].count);
    });
  });
}
