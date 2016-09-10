var DBhandler = require('../DBhandler.js');
var DBconstructor = require('../DBconstructor.js');
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
  DBconstructor.createDB('root', 'XXXX', 5, 'Please change me!', req.params.year);
  res.end('success? yolo');
})

module.exports = router;
