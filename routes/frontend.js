var router = require('express').Router();
var DBhandler = require('../DBhandler.js');
var auth = require('../auth.js');

router.get('/', function(req, res) {
  req.session = null; // reset the session on landingpage
  res.render('index');
});

router.get('/admin', auth, function(req, res){
  res.render('adminpanel');
});

module.exports = router;
