var mailer = require('../email/mailer.js');

var userData = {
  email: Math.random().toString(36).substr(2,6) + '@asdf.de',
  first_name: 'Heinz',
  last_name: 'Kjuni',
  gender: 'male',
  address: 'Plksdflkjdsf',
  post_code: 9879,
  city: 'Aachen',
  mobile: '09823487345',
  birthday: '1994-04-02',
  study: 'geoinf',
  veggie_level: 'vegan',
  comment: ''
};

mailer.sendMail('general_info.html', 'test', 'noerw@gmx.de');
