const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'floyd.crona@ethereal.email',
        pass: 'QVrX5bzcgCJ41pp6jR'
    }
});

const sendMail = async (email, subject, content) => {
    try {
        var mailOptions = {
            from: 'floyd.crona@ethereal.email',
            to: email,
            subject: subject,
            html: content
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            console.log('mail sent', info.messageId);
        });

    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    sendMail
}
