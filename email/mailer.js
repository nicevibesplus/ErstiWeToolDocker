var config = require('../config.js');
var nodemailer = require('nodemailer');
var cook = require('handlebars');
var fs = require('fs');

/*
 Sends an Email generated from the given template and subject line to the specified Email Adresses. Template-specific personalized Info from the User is extracted from userdata.
 */
exports.sendMail = function(template,subject,emailaddress,userdata){
  readHTMLFile(template,subject,emailaddress, userdata, function(err,subject, emailaddress,userdata,html){
    var transporter = nodemailer.createTransport(config);
    var template = cook.compile(html);
    var replacements = userdata;
    var finalhtml = template(replacements);

    transporter.sendMail({
      to: emailaddress,
      subject: subject,
      from: config.from,
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
var readHTMLFile = function(template,subject,emailaddress,userdata,cb) {
    fs.readFile(__dirname + '/' + template, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            cb(err);
        }
        else {
            cb(null,subject,emailaddress,userdata,html);
        }
    });
};