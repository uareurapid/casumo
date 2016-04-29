/**
 * Created by paulocristo on 31/10/15.
 */



var MailerService = function() {



};

MailerService.sendEmail = function (req, res, callback) {

    var mailer =  require('nodemailer');
    //https://www.google.com/settings/security/lesssecureapps

    console.log("sendemail");
    // create reusable transporter object using SMTP transport
    var transporter = mailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'pcdreamssoftware@gmail.com',
            pass: 'evsuhe2003pcdreams'
        }
    });

    var mailOptions = {
        from: '<pcdreamssoftware@gmail.com>', // sender address
        to: '<cristo.paulo@gmail.com>', // list of receivers
        subject: 'Email Example', // Subject line
        text: "text" //, // plaintext body
        // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
        callback(info.response);

    });

};

module.exports = MailerService;