/**
 * Function to return a QR code options
 */
 const qrcode = require('qrcode');

 function generateQRCodeForUrl(data){
    let urlToSend = "";
        qrcode.toDataURL(data, function (err, url) {
            if (err) throw err;
            // console.log(url);
            urlToSend = url;
        });
        return urlToSend;
 };

function generateQRCodeForData(data){
    let urlToSend = "";
    qrcode.toDataURL(data, function (err, url) {
        if (err) throw err;
        // console.log(url);
        urlToSend = url;
    });
    return urlToSend;
}
module.exports = {
    generateQRCodeForUrl,
    generateQRCodeForData
}