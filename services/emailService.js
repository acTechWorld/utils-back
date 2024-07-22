require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express');
const licencingKeyRepository = require('../repositories/licencingKeyRepository');
const crypto = require('crypto');

const router = express.Router();
const mappingSourceEmail= {
    vueLanding: 'vuelandingcontact@gmail.com'
}


// POST endpoint to handle form submissions
router.post('/send-contact-email', (req, res) => {
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

// POST endpoint to handle form submissions
router.post('/send-licencing-key-email', async (req, res) => {
    const { source, firstname, email, duration } = req.body;
    if(source && mappingSourceEmail[source]) {
        if(duration && duration > 0) {
            try {
                const licencingKey = crypto.randomBytes(16).toString('hex'); 
                await licencingKeyRepository.createLicencingKey(source, licencingKey, duration)
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
                    from: mappingSourceEmail[source],
                    to: email, // Your receiving email address
                    subject: `Licencing Key ${source}`,
                    text: 
                    `Hello ${firstname},
            Here is your licencing key: ${licencingKey}`,
                };
            
                // Send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return res.status(500).send(error.toString());
                    }
                    res.status(200).send('Message sent successfully!');
                });
            } catch (error) {
                return res.status(500).send(error.toString());
            }
        } else {
            return res.status(400).send('invalid duration');
        }
    } else {
        return res.status(400).send('invalid source name');
    }
});

module.exports = router;