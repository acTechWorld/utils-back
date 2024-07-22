// index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const emailService = require('./services/emailService');
const licencingKeyService = require('./services/licencingKeyService');


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/email', emailService);
app.use('/api/licencing', licencingKeyService);


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
