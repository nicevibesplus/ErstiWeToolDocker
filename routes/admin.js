var db = require('../DBhandler.js');
var router = require('express').Router();
var auth = require('../auth.js');

router.use(auth);

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
