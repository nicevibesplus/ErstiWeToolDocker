var cfg = require('../config.js');
var nodemailer = require('nodemailer');
var cook = require('handlebars');
var fs = require('fs');

/*
 Sends an Email generated from the given template and subject line to the specified Email Adresses. Template-specific personalized Info from the User is extracted from userdata.
 */
exports.sendMail = function(templateName, subject, emailaddress, userdata) {
  readHTMLFile(templateName, function(err, html) {
    var transporter = nodemailer.createTransport(cfg.mailer);
    var finalhtml = cook.compile(html)(userdata);

    transporter.sendMail({
      to: emailaddress,
      subject: subject,
      from: cfg.mailer.from,
      html: finalhtml
    }, function(err,info){
      if(err)
        console.log(err);
    });
  });
};

/*
 * Reads a html File and tunnels it to cb function
 */
var readHTMLFile = function(template, cb) {
    fs.readFile(__dirname + '/' + template, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            cb(err);
        }
        else {
            cb(null, html);
        }
    });
};
