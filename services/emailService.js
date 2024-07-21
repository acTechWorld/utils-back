require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express');

const router = express.Router();
const mappingSourceEmail= {
    vueLanding: 'vuelandingcontact@gmail.com'
}


// POST endpoint to handle form submissions
router.post('/send-email', (req, res) => {
    const { source, firstname, lastname, email, companyName, phoneNumber, message } = req.body;

    // Create a transporter object using Gmail SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Setup email data
    let mailOptions = {
        from: email,
        to: mappingSourceEmail[source], // Your receiving email address
        subject: `New contact form submission from ${firstname} ${lastname}`,
        text: 
        `Name: ${firstname} ${lastname}
Email: ${email}
Company Name: ${companyName}
Phone Number: ${phoneNumber}
Message: ${message}`,
    };

    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Message sent successfully!');
    });
});

module.exports = router;