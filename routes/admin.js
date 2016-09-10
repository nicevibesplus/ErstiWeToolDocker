var db = require('../DBhandler.js');
var router = require('express').Router();
var auth = require('http-auth');

// secure the admin panel via http basic auth
router.use(auth.connect(auth.basic({
  realm: 'ErstiWeTool',
  file: './admin.htpasswd'
})));

router.get('/', function(req, res){
  res.render('adminpanel');
});

router.get('/resetDatabase/:year', function(req, res) {
  // TODO: load credentials from config file or ENV?
  // TODO: check success?
  console.log(req.params);
  res.end(501, 'not implemented');
})

module.exports = router;
