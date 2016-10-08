/**
 * configuration template for ErstiWeTool
 */

module.exports = {
  http_port: 3000,

  // affects the database queries & email templates
  year: 2016,
  attendee_cost: 40,
  dates: {
    begin: '2016-10-28T09:30:00Z',
    end: '2016-10-30T13:00:00Z'
  },
  // delay for the waitlist token-notification mails in minutes
  waitlistDelay: {
    min: 30,
    max: 480 // 8 hours
  },

  // if you change these values, also change them in schema.sql !
  mysql: {
    database: 'ersti-we',
    host: 'localhost',
    user: 'ersti-we',
    password: 'test',
    connectionlimit: 25,
  },

  mailer: {
    host: 'secmail.uni-muenster.de', // SMTP Server
    port: 587,
    auth: {
      user:'testuser',
      pass:'test'
    },
    from: '"Foo Bar" <baz@test.com>', // Email address which to send from
    requireTLS: true, // Use STARTTLS
    pool: true, // Use connection pool
    maxConnections: 10, // Maximum number of connections
  },
};

