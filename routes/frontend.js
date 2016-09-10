var router = require('express').Router();
var DBhandler = require('../DBhandler.js');

router.get('/', function(req, res) {
  req.session = null; // reset the session on landingpage
  res.render('index');
});

// must be post, else the token is sent in req.query -> unsafe?
router.post('/register', function(req, res){
  req.session.token = req.body.token;

  DBhandler.checkToken(req.session.token, function(authorized){
    // TODO: throw error for user
    authorized ? res.render('register') : res.redirect('/');
  });
});

/* User review (registration step 2) */
// TODO: handle registration in API, then redirect if successful?
router.post('/review', function(req, res){
  var veggie, study;
  /*
      switch(req.body.veggie_level){
      case '0':
        veggie ='Auch mit Fleisch';
        break;
      case '1':
        veggie = 'Vegetarisch';
        break;
      case '2':
        veggie='Vegan';
        break;
      default:
        veggie='keine Angabe';
    }
      switch(study){
      case '0':
        study= 'Geoinformatik';
        break;
      case '1':
        study='Geographie';
        break;
      case '2':
        study='Landschaftsökologie';
        break;
      case '3':
        study='Zwei-Fach-Bachelor';
        break;
      default:
        study='keine Angabe';
    }
    */
    DBhandler.checkEmail(req.body.email, function(bool){
      if(bool){
        res.render('register_review', {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          address: req.body.address,
          post_code: req.body.post_code,
          city: req.body.city,
          email: req.body.email,
          mobile: req.body.mobile,
          birthday: req.body.birthday,
          study: study,
          veggie_level: veggie,
          comment: req.body.comment,
        });
      } else {
        /* Invalid Email (Duplicate) - Maybe throw error to User?*/
        res.redirect('/');
      };
    });
});

/* Email Confirmation */
router.get('/email', function(req,res){
  DBhandler.checkToken(req.session.token, function(authorized){
    if (authorized) {
      DBhandler.insertuser(false,req.body,req.session.token);
      res.render('emailconfirmation');
    } else {
      DBhandler.insertuser(true,req.body,req.session.token);
      res.render('emailconfirmation');
    };
  });
});

module.exports = router;
