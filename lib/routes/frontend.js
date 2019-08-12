var router = require('express').Router();
var DBhandler = require('../DBhandler');
var auth = require('../auth');
const cfg = require('../../config')

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/admin', auth, function(req, res){
  res.render('admin', { year: req.query.year || cfg.year });
});

module.exports = router;
