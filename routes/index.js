var express = require('express');
var router = express.Router();
var DBconstructor = require('../DBconstructor.js');
var DBhandler = require('../DBhandler.js');
var auth = require('../auth.js');
var DBpsw = 'Please change me!';

/* GET home page. */
router.get('/', function(req, res) {
  req.session.token = '';
  
  // DEBUG ONLY
  DBhandler.createConnectionPool(DBpsw);
  
  res.render('token_auth');
});

/* User Input*/
router.post('/userinput', function(req,res){
  req.session.token = req.body.token;
  if(req.body.token == undefined){
    req.session.token = '________';
    res.render('userinput');
  }else{
    DBhandler.checkToken(req.body.token, function(bool){
      if(bool){res.render('userinput')}else{res.redirect('/')};  
    });
  }
});

/* User review*/
router.post('/review', function(req,res){
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
          res.render('userreview', {
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
        }else{/*Invalid Email (Duplicate) - Maybe throw error to User?*/ res.redirect('/');};
     });
});

/* Email Confirmation */
router.post('/email', function(req,res){
  DBhandler.checkToken(req.session.token, function(bool){
    if(bool){
          DBhandler.insertuser(false,req.body,req.session.token);  
          res.render('emailconfirmation');
        }else{
          DBhandler.insertuser(true,req.body,req.session.token);
          res.render('emailconfirmation');
        };  
    });
}); 


/* GET AdminPanel*/
router.get('/AdminPanel', /*auth, */ function(req,res){
  // Uncomment to create DB
  //DBconstructor.createDB('root','specki',70,DBpsw);
  res.send('auth successful');
});

module.exports = router;

