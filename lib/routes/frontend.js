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
      years: years || []
    }
    res.render('admin', locals)
  })
});

router.get('/admin/print/:aspect', auth, function(req, res){
  res.render(`admin_print_${req.params.aspect}`, {
    year: req.query.year || cfg.year
  });
})

module.exports = router;
