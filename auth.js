var auth = require('http-auth');

var basic = auth.basic({
  realm: 'ErstiWeTool',
  file: './admin.htpasswd'
});

module.exports = auth.connect(basic);
