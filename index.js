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
app.use(cors());

// Routes
app.use('/api/email', emailService);
app.use('/api/licencing', licencingKeyService);
app.use('/api/user', userService);


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
