var async = require('async');
var cfg = require('./config.js');
var mysql = require('mysql');

var pool = null;

/**
 * wraps the connection handling
 * @params {String}       query    the SQL query
 * @params {Array|Object} params   Params to supply to the query (?)
 * @params {Function}     callback called with the results
 *
 */
function queryWrapper(query, params, callback) {
  if (!pool) return callback('DB connection not initialized!');

  pool.getConnection(function(err, conn) {
    if (err)
      return callback('could not retrieve DB connection: ', err);

    conn.query(query, params, function(err, result) {
      conn.release();
      callback(err, result);
    });
  });
}

/*
 Creates the Database Connection.
*/
exports.connect = function() {
  pool = mysql.createPool(cfg.mysql);
};

/**
 * Creates [amount] tokens for the current year
 * callback returns an array of generated tokens
 */
exports.createTokens = function(amount, callback) {
  var year = cfg.year;
  var tokens = [];
  var query = 'INSERT INTO users (token, year) VALUES (?, ?);';

  while (tokens.length < amount) {
      var token = Math.random().toString(36).substr(2,8);
      // Check for duplicates. Register tokens must be unique
      if (tokens.indexOf(token) == -1) tokens.push(token);
  }

  // insert at most [cfg.mysql.connectionlimit] tokens at once
  async.eachLimit(tokens, cfg.mysql.connectionlimit, function(token, cb) {
    queryWrapper(query, [token, year], cb);
  }, (err) => callback(err, tokens));
};

/*
 * Adds a user, if the provided token exists
 * @param {json} data - User Information
 */
exports.insertUser = function(data, callback) {
  var tokenQuery = 'SELECT COUNT(*) AS count FROM users WHERE token=? AND state=\'free\';';
  var insertQuery = 'UPDATE users SET ?, state=\'registered\' WHERE token=? AND year=?;';

  // TODO: sanitize user inputs
  // for (var prop of data) { data[prop].sanitize() ....?

  async.series([
    // validate token
    function(next) {
      queryWrapper(tokenQuery, [data.token], function(err, rows) {
        if (err) next(err);
        rows[0].count ? next() : next('invalid token');
      });
    },
    // insert new empty user
    async.apply(queryWrapper, insertQuery, [data, data.token, cfg.year])
  ], callback);
};

/*
  Gets all user entries for the given year.
  @param {int} year - Year
*/
exports.getUsers = function(year, callback) {
  var q = 'SELECT * FROM users WHERE year=?;';
  queryWrapper(q, [year], callback);
}

/*
  Gets all user entries on waiting list in given year.
  @param {int} year - Year
*/
exports.getWaitlist = function(year, callback) {
  var q = 'SELECT * FROM waitlist WHERE year=?;';
  queryWrapper(q, [year], callback);
};

/*
  Inserts a User into the Waiting list in year defined by config.js.
  @param {string} email - Email of the user
*/
exports.insertWaitlist = function(email, callback) {
  var q = 'REPLACE INTO waitlist (email, year) VALUES (?, ?);';
  queryWrapper(q, [email, cfg.year], callback);
};

/*
  Marks a user as not participating.
  @param {string} email - Email of the user
*/
exports.optoutUser = function(token, email, callback) {
  var tokenCheckQuery = 'SELECT COUNT(*) AS count FROM users WHERE token=? AND email=? AND state=\'registered\';';
  var optoutQuery = 'UPDATE users SET state=\'opted_out\' WHERE token=? AND year=?;';
  var addRefQuery = 'UPDATE users SET prev_user=? WHERE token=? AND year=?;';
  var newToken = '';

  async.series([
    // check if token:email pair is valid
    function(next) {
      queryWrapper(tokenCheckQuery, [token, email], function(err, rows) {
        if (err) return next(err);
        rows[0].count ? next() : next('invalid token:email pair');
      });
    },
    // mark user opted out
    async.apply(queryWrapper, optoutQuery, [token, cfg.year]),
    // create new token
    function(next) {
      exports.createTokens(1, function(err, tokens) {
        newToken = tokens[0];
        next(err);
      });
    },
    // add reference to previous user to new user
    function(next) {
      queryWrapper(addRefQuery, [token, newToken, cfg.year], next);
    },
    //async.apply(queryWrapper, addRefQuery, [token, newToken, cfg.year])
  ], (err) => callback(err, newToken));
};

/*
  Returns the number of attendants for given year to cb function.
  @param {int} year - Year
*/
exports.countAttendants = function(year, cb) {
  var q = 'SELECT COUNT(*) AS count FROM users WHERE year=? AND state=\'registered\';';
  queryWrapper(q, [year || cfg.year], (err, rows) => cb(err, rows[0].count));
}
