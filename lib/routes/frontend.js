var router = require('express').Router();
var auth = require('../auth');
const cfg = require('../../config')
const db = require('../DBhandler')

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/admin', auth, function(req, res){
  db.getYears((err, years) => {
    const locals = {
      year: req.query.year || cfg.year,
      years: years ? years.map(x => x.year) : [],
    }
    res.render('admin', locals)
  })
});

module.exports = router;
