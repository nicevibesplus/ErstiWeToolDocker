var rootconn;
var userconn;
var mysql = require('mysql');

exports.createDB = function(rootuser, rootpsw, tokencount, nodepsw, year){
    // TODO: leave user as is, should be done manually when deploying
    // TODO: change schema:
    // - each year has one table, not DB
    // - only one table: token = user ID

    var currentyear = year || (new Date()).getFullYear();

    // Creating DB Connection
    rootconn = mysql.createConnection({
        host : 'localhost',
        user : rootuser,
        password : rootpsw
    });

    // Connecting to DB
    rootconn.connect();

    // Creating Database
    rootconn.query('DROP DATABASE IF EXISTS ErstiWe' + currentyear + ';', function(err){if (err){console.error('WARN: Error Dropping deprecated Databases %s', err)}});
    rootconn.query('CREATE DATABASE ErstiWe' + currentyear + ';', function(err){if (err){console.error('WARN: Error creating Database %s', err)}});
    rootconn.query('USE ErstiWe' + currentyear + ';');

    // Creating Nodejs MYSQL User
    rootconn.query('DROP USER \'nodejs_erstiwe\';', function(err){if (err) {console.error('INFO: Cannot drop User %s', err)}});
    rootconn.query('FLUSH PRIVILEGES;');
    rootconn.query('CREATE USER \'nodejs_erstiwe\' IDENTIFIED BY \'' + nodepsw +'\';', function(err){if(err){console.error('WARN: Error creating User %s', err)}});
    rootconn.query('GRANT CREATE,INSERT,UPDATE,SELECT,DELETE ON ErstiWe' + currentyear + '.* TO \'nodejs_erstiwe\';', function(err){if (err){console.error('WARN: Error granting rights to User %s', err)}});
    rootconn.query('FLUSH PRIVILEGES');

    // Creating User Table
    createUserList('users');

    // Creating Token List
    rootconn.query('CREATE TABLE token (token VARCHAR(8) UNIQUE);', function(err){if (err){console.error('WARN: Error creating Token table %s', err)}});

    // Inserting Token into Table
    createToken(tokencount);
    rootconn.end(function(err){if (err){console.error('WARN: Error disconnecting from Database %s', err)}});
};


function createUserList(name){
    rootconn.query('CREATE TABLE ' + name + '(email VARCHAR(50) PRIMARY KEY, firstname VARCHAR(40) NOT NULL, lastname VARCHAR(40) NOT NULL, gender TINYINT NOT NULL, address VARCHAR(40) NOT NULL, zip MEDIUMINT NOT NULL, city VARCHAR(25) NOT NULL, mobile VARCHAR(20) NOT NULL, birthday DATE NOT NULL, study TINYINT NOT NULL, food TINYINT NOT NULL, additionalinfo TEXT, deleteToken VARCHAR(8) NOT NULL, waiting BOOLEAN);', function(err){if (err){console.error('WARN: Error creating User List Table %s', err)}})
};

function createToken(amount){
    var tokencount = 0;

    // Inserting Tokens as long as there is still free space
    while(tokencount < amount){
        var token = Math.random().toString(36).substr(2,8);
        rootconn.query('INSERT INTO token (token) VALUES (\'' + token + '\');', function(err){if (err){console.error('Error Inserting Token: %s', err); tokencount--;}});
        tokencount++;
    };
}
