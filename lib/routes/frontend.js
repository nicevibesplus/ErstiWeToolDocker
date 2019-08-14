var router = require('express').Router();
var auth = require('../auth');
const cfg = require('../../config')
const db = require('../DBhandler')

router.get('/', function(req, res) {
  res.render('index');
});

router.use(auth)

router.get('/admin', function(req, res){
  db.getYears((err, years) => {
    const locals = {
      year: req.query.year || cfg.year,
      years: years || []
    }
    res.render('admin', locals)
  })
});

router.get('/admin/print/:aspect', function(req, res){
  const year = req.query.year || cfg.year
  db.getAttendees(year, (err, attendees) => {
    res.render(`admin_print_${req.params.aspect}`, { attendees, year })
  })
})

module.exports = router;
