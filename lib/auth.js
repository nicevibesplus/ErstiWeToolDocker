const auth = require('http-auth'),
  path = require('path');

const basic = auth.basic({
  realm: 'ErstiWeTool',
  file: path.join(__dirname, '../admin.htpasswd')
});

module.exports = auth.connect(basic);
