/**
 * configuration template for ErstiWeTool
 */

module.exports = {
  http_port: 3000,
  mysql_dbname: 'ersti-we', // if you change these, also change them in the schema.sql file!
  mysql_host: 'localhost',
  mysql_user: 'ersti-we',
  mysql_pass: 'test',
  mysql_poolsize: 25,
  year: 2016,
  
  //SMTP Configuration (Mail)
  pool: true, // Use connection pool
  host: 'secmail.uni-muenster.de', // SMTP Server
  port: 587, 
  requireTLS: true, // Use STARTTLS
  maxConnections: 10, // Maximum number of connections
  auth: {
    user:'testuser',
    pass:'test'
  },
  from: 'test@test.test'// Email address which to send from 
};

