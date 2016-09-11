var router = require('express').Router();
var DBhandler = require('../DBhandler.js');

router.get('/', function(req, res) {
  req.session = null; // reset the session on landingpage
  res.render('index');
});

module.exports = router;
