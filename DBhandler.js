var pool;

exports.createConnectionPool = function(nodepsw){
  pool = (require('mysql')).createPool({
    connectionlimit : 25,
    host : 'localhost',
    user : 'nodejs_erstiwe',
    password : nodepsw,  
    database : 'ErstiWe' + (new Date()).getFullYear(),
  });
};

exports.insertuser = function(waiting, userdata, token){
  if(pool == null){console.log('WARN: Not connected to DB')}
  else{
    var deleteToken = Math.random().toString(36).substr(2,8);
  
    pool.getConnection(function(err, connection){
      connection.beginTransaction(function(err) {
        connection.query('INSERT INTO users (email,firstname,lastname,gender,address,zip,city,mobile,birthday,study,food,additionalinfo,deletetoken,waiting) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);',[userdata.email, userdata.first_name, userdata.last_name, userdata.gender,userdata.address, userdata.post_code, userdata.city, userdata.mobile, userdata.birthday, userdata.study, userdata.veggie_level, userdata.comment, deleteToken, waiting], function(err){
            if (err){console.log(err);}});
        connection.query('DELETE FROM token WHERE token=?', [token],function(err){if (err) console.log(err)});
        connection.commit(function(err){
          if(err){
            return connection.rollback(function(err){throw err;});
          };
        connection.release();
        });
      });
    });
  };
  };

exports.checkToken = function(token, next){
  if(pool == null){console.log('WARN: Not connected to DB'); next(false);}
  else{
    pool.getConnection(function(err,connection){
        if (err){console.log(err); next(false);};
        connection.query('SELECT token AS token FROM token WHERE token=?',[token],function(err,rows){
          try{
            connection.release();
            if(rows[0].token == token) {next(true);}else{next(false);};
          }catch(error){next(false);}
        });
    });
  };
};

/* -------------------------------------------------------DEPRECATED-------------------------------------------------------------
// Move User from Waiting to Current
exports.moveuser= function(email,next){
  if(pool == null){console.log('WARN: Not connected to DB'); next(false);}
  else{
    pool.getConnection(function(err,connection){
        if (err){console.log(err); next(false);};
        connection.query('INSERT INTO accepted  (SELECT * FROM waiting WHERE email=?', [email], function(err){
          connection.query('DELETE FROM waiting WHERE email=?', [email], function(err){
            if(err){next(false);}else{next(true);};
            connection.release();
          });
        });
    });
  };
};


exports.confirmemail= function(email,next){
  if(pool == null){console.log('WARN: Not connected to DB'); next(false);}
  else{
    pool.getConnection(function(err,connection){
        if (err){console.log(err); next(false);};
        connection.query('UPDATE accepted SET email_confirmed=true WHERE email=?',[email],function(err,rows){
            if(err){next(false);}else{next(true);};
            connection.release();
        });
    });
  };
};
*/

exports.userexists = function(email, next){
  if(pool == null){console.log('WARN: Not connected to DB'); next(false);}
  else{
    pool.getConnection(function(err,connection){
        if (err){console.log(err); next(false);};
        connection.query('SELECT COUNT(*) AS count FROM users WHERE email=?',[email],function(err,rows){
          try{
            connection.release();
            if(rows[0].count == 1) {next(true);}else{next(false);};
          }catch(error){next(false);}
        });
    });
  };
};

// What about deletetoken verification?
exports.deleteuser = function(table,email,next){
  if(pool == null){console.log('WARN: Not connected to DB'); next(false);}
  else{
    pool.getConnection(function(err,connection){
        if (err){console.log(err); next(false);};
        connection.query('DELETE FROM  ' + table + ' WHERE email=?',[email],function(err,rows){
            connection.release();
            if(err){next(false);}else{next(true);};
        });
    });
  };
};

//TODO: 
exports.getEmail= function(){};
exports.getTable= function(){};