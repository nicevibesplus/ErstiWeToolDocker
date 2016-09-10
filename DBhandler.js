var pool;

/*
  Creates the Database Connection.
  @param {string} nodepsw - Password for the Database User nodejs_erstiwe
*/
exports.createConnectionPool = function(nodepsw){
  pool = (require('mysql')).createPool({
    connectionlimit : 25,
    host : 'localhost',
    user : 'nodejs_erstiwe',
    password : nodepsw,
    database : 'ErstiWe' + (new Date()).getFullYear(),
  });
};

/*
  Inserts a new User into the Users table. Deletes the Access token from the Database.
  If there is a problem during the operation (Invalid token, Invalid Userdata) the operation is reversed.
  @param {boolean} waiting - Is the User on the Waiting list?
  @param {json} userdata - JSON of User Data
  @param {string} token - 8 character long access token
*/
exports.insertuser = function(waiting, userdata, token){
  if(pool == null){console.log('WARN: Not connected to DB')}
  else{
    var deleteToken = Math.random().toString(36).substr(2,8);

    pool.getConnection(function(err, connection){
      connection.beginTransaction(function(err) {
        connection.query('INSERT INTO users (email,firstname,lastname,gender,address,zip,city,mobile,birthday,study,food,additionalinfo,deletetoken,waiting) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);',[userdata.email, userdata.first_name, userdata.last_name, userdata.gender,userdata.address, userdata.post_code, userdata.city, userdata.mobile, userdata.birthday, userdata.study, userdata.veggie_level, userdata.comment, deleteToken, waiting], function(err){
            if (err){console.log(err);}});
        connection.query('DELETE FROM token WHERE token=?;', [token],function(err){if (err) console.log(err)});
        connection.commit(function(err){
          if(err){
            return connection.rollback(function(err){/*throw err;*/});
          };
        connection.release();
        });
      });
    });
  };
  };

/*
  Checks if token is still valid (e.g. token still in tokenlist)
  Calls next() with parameter true if Operation was successfull, false otherwise.
  @param {string} token - 8 Character long access token
*/
exports.checkToken = function(token, next){
  if(pool == null){console.log('WARN: Not connected to DB'); next(false);}
  else{
    pool.getConnection(function(err,connection){
        if (err){console.log(err); next(false);};
        connection.query('SELECT token AS token FROM token WHERE token=?;',[token],function(err,rows){
          try{
            connection.release();
            if(rows[0].token == token) {next(true);}else{next(false);};
          }catch(error){next(false);}
        });
    });
  };
};

/*
  Checks if User (identified by email) is in the Userlist
  Calls next() with parameter true if Operation was successfull, false otherwise.
  @param {string} email - Email of User
*/
exports.checkEmail = function(email, next){
  if(pool == null){console.log('WARN: Not connected to DB'); next(false);}
  else{
    pool.getConnection(function(err,connection){
        if (err){console.log(err); next(false);};
        connection.query('SELECT COUNT(*) AS count FROM users WHERE email=?;',[email],function(err,rows){
          try{
            connection.release();
            if(rows[0].count) {next(false);}else{next(true);};
          }catch(error){next(false);}
        });
    });
  };
};
/*
  Move User from Waiting to Current
  Calls next() with parameter true if Operation was successfull, false otherwise.
  @param {string} email - Email of User
*/
exports.setActive= function(email,next){
  if(pool == null){console.log('WARN: Not connected to DB'); next(false);}
  else{
    pool.getConnection(function(err,connection){
        if (err){console.log(err); next(false);};
        connection.query('UPDATE users SET waiting WHERE email=?;', [email], function(err){
            connection.release();
            if(err){next(false);}else{next(true);};
        });
    });
  };
};

/*
  Deletes User from Userlist.
  Calls next() with parameter true if Operation was successfull, false otherwise.
  @param {string} email - Email of User
*/
exports.deleteuser = function(email,token,next){
  if(pool == null){console.log('WARN: Not connected to DB'); next(false);}
  else{
    checkDeleteToken(email,token, function(bool,email){
      if(bool){
      pool.getConnection(function(err,connection){
          if (err){next(false);};
            connection.query('DELETE FROM users WHERE email=?;',[email],function(err,rows){
                connection.release();
                if(err){next(false);}else{next(true);};
            });
        });
      }else{/* delete_token invalid*/}
    });
  };
};

/*
  Checks if delete_token is valid.
  Calls next() with parameter true if Operation was successfull, false otherwise.
  @param {string} token - 8 Character long access token
  @param  {string} email - Email of user
*/
exports.checkDeleteToken = function(email,token,next){
  if(pool == null){console.log('WARN: Not connected to DB'); next(false);}
  else{
    pool.getConnection(function(err,connection){
        if (err){console.log(err); next(false,email);};
        connection.query('SELECT delete_token AS token FROM users WHERE email=?;',[email],function(err,rows){
          try{
            connection.release();
            if(rows[0].token == token) {next(true,email);}else{next(false,email);};
          }catch(error){next(false,email);}
        });
    });
  };
};

//TODO:
exports.getEmail= function(){};
exports.getTable= function(){};
