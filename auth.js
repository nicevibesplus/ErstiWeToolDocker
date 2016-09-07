var http_auth = require('http-auth');

module.exports= function() {
    basic = http_auth.basic({
    realm: 'ErstiWeTool',
    file: './admin.htpasswd'  
  });
  
  return http_auth.connect(basic);
};