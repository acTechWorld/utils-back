require('dotenv').config();
const validateToken = require('../utils/token')
const nodemailer = require('nodemailer');
const express = require('express');
const licencingKeyRepository = require('../repositories/licencingKeyRepository');
const crypto = require('crypto');
const vueLandingPackageToken = process.env.GITHUB_VUE_LANDING_PACKAGE_TOKEN
const router = express.Router();
const mappingSourceInfos = {
    vueLanding: {
        email: 'vuelandingcontact@gmail.com',
        githubKey: vueLandingPackageToken,
        installDoc: 'https://vuelanding.com/docInstall'
    }
}


// POST endpoint to handle form submissions
router.post('/send-contact-email', validateToken, (req, res) => {
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
        to: mappingSourceInfos[source].email, // Your receiving email address
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
router.post('/send-licencing-key-email', validateToken, async (req, res) => {
    const { source, firstname, email, duration } = req.body;
    if(source && mappingSourceInfos[source].email) {
        if(duration === null || (duration && duration > 0)) {
            try {
                // Check if the user already has a valid key
                const existingKeys = await licencingKeyRepository.findLicencingKeyByEmailProject(email, source);
                

                if (existingKeys && existingKeys.length > 0) {
                    for (existingKey of existingKeys) {
                        const currentTime = Date.now();
                        const creationTime = new Date(existingKey.creation_date).getTime();
                        const validUntil = creationTime + existingKey.duration;

                        if (existingKey.duration === null || validUntil > currentTime) {
                            return res.status(405).send('User already has a valid licensing key');
                        }
                    }
                }

                const licencingKey = crypto.randomBytes(16).toString('hex'); 
                await licencingKeyRepository.createLicencingKey(email, source, licencingKey, duration)
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
                    from: mappingSourceInfos[source].email,
                    to: email, // Your receiving email address
                    subject: `Licencing Key ${source}`,
                    text: 
                    `Hello ${firstname}, \n
Here is your licencing key: ${licencingKey}
Here is the github token to download the package: ${mappingSourceInfos[source].githubKey}
Here is the documentation for the installation of the library: ${mappingSourceInfos[source].installDoc}`,
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