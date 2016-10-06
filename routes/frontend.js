var router = require('express').Router();
var DBhandler = require('../DBhandler.js');
var auth = require('../auth.js');

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/admin', auth, function(req, res){
  res.render('admin');
});

module.exports = router;
