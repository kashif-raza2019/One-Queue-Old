require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// const message = client.messages
//   .create({
//      body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
//      from: '+15017122661',
//      to: '+917067934747'
//    })
//   .then(message => console.log(message.sid));

function sendMessages(message, number) {
    client.messages
        .create({
            body: message,
            from: '+15739283642',
            to: number
        })
        .then(message => console.log(message.sid));
}

sendMessages("Hello World", "+917067934747");

// module.exports = sendMessages;