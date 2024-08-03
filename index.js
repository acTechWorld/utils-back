// index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const emailService = require('./services/emailService');
const licencingKeyService = require('./services/licencingKeyService');
const userService = require('./services/userService');


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());



// Configure CORS to only allow requests from your frontend domain
const corsOptions = {
    origin: 'http://vuelanding.com', // Replace with your frontend's domain
    optionsSuccessStatus: 200,
    credentials: true // This allows cookies to be sent
};

app.use(cors(corsOptions));

//IP security
const allowedIPs = [
    '86.195.103.7', // Replace with actual allowed IP addresses
];

// Middleware to check for allowed IP addresses
const ipWhitelist = (req, res, next) => {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Remove any port information from the IP address
    const cleanIP = clientIP.split(':')[0];
    
    if (allowedIPs.includes(cleanIP)) {
      next();
    } else {
      res.status(403).send('Access forbidden');
    }
};
// Apply IP whitelist middleware
app.use(ipWhitelist);
  

// Routes
app.use('/api/email', emailService);
app.use('/api/licencing', licencingKeyService);
app.use('/api/user', userService);


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
