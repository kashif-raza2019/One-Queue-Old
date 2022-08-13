/**
 * Function to mail a message to a user
 * @param {string} to - The email address of the user to mail to
 * @param {string} subject - The subject of the email
 * @param {string} message - The message to send
 * @param {string} from - The email address of the user sending the email
 * @param {string} password - The password of the user sending the email
 * @param {string} host - The host of the email server
 * @param {string} port - The port of the email server
 * @param {string} secure - Whether the email server is secure or not
 * @param {string} tls - Whether the email server is using TLS or not
 * 
 * Host : GMAIL
 * Port : 587
 * Secure : true
 * TLS : true
 * username: onequeue.sih@gmail.com
 * password: locvgfxvvybhxiko
 */
const nodeMailer = require('nodemailer');

function sendEmail(to, subject, message){
    const from = "onequeue.sih@gmail.com";
    const password = "locvgfxvvybhxiko";
    var mailOptions = {
        from: from,
        to : to,
        subject :subject,
        html : message
    };

    const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth:{
            user: 'onequeue.sih@gmail.com',
            pass: 'locvgfxvvybhxiko'
        }
    });

    transporter.sendMail(mailOptions, (err, info)=>{
            if(err){
                console.error(err);
                return false;
            }else{
                console.log('Email Sent!' + info.response);
                return true;
            }
    });  
    return true;
}


module.exports = sendEmail;