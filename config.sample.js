/**
 * configuration template for ErstiWeTool
 */

module.exports = {
  http_port: 3000,

  // affects the database queries & email templates
  year: 2016,
  dates: {
    begin: ['28. Oktober', '09:30'],
    end:   ['30. Oktober', '13:00']
  },

  mysql: {
    dbname: 'ersti-we', // if you change these, also change them in the schema.sql file!
    host: 'localhost',
    user: 'ersti-we',
    pass: 'test',
    poolsize: 25,
  },

  mailer: {
    host: 'secmail.uni-muenster.de', // SMTP Server
    port: 587,
    auth: {
      user:'testuser',
      pass:'test'
    },
    from: 'test@test.test', // Email address which to send from
    requireTLS: true, // Use STARTTLS
    pool: true, // Use connection pool
    maxConnections: 10, // Maximum number of connections
  },
};

