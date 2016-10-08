var db = require('../DBhandler.js');
var mailer = require('../email/mailer.js');

var userData = {
  email: 'noerw@gmx.de',
  firstname: 'Heinz',
  lastname: 'Kjuni',
  gender: 'male',
  phone: '09823487345',
  birthday: '1994-04-02',
  study: 'Geoinformatik',
  food: 'vegan',
  comment: '',
  year: 2016,
  token: 'asdfasdf'
};

db.connect();

/*mailer.sendRegistrationMail(userData, function(err, info) {
  if (err) return console.error(err);
  console.log(info);
  process.exit();
});*/

mailer.sendWaitlistNotification('asdfasdf', function(err, res) {
  console.log(err);
  console.log(res);
});
