const nodemailer = require("nodemailer")

module.exports.sendMail = (email, subject, html) => {
  const smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email, 
        subject: subject,
        html: html,
    }

    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            res.redirect('/');
        }
    });
}