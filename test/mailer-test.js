var mailer = require('../email/mailer.js');

var userData = {
  email: 'noerw@gmx.de',
  first_name: 'Heinz',
  last_name: 'Kjuni',
  gender: 'male',
  address: 'Hausweg 3, 03566, Münster',
  phone: '09823487345',
  birthday: '1994-04-02',
  study: 'geoinf',
  food: 'vegan',
  comment: '',
  year: 2016,
  token: 'asdfasdf'
};

mailer.sendRegistrationMail(userData, function(err, info) {
  if (err) return console.error(err);
  console.log(info);
  process.exit();
});
