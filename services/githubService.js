const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const router = express.Router();

// Load the private key
const privateKey = fs.readFileSync(path.resolve(__dirname, '../env/githubPrivateKey.pem'));

// GitHub App ID and Installation ID
const appId = process.env.GITHUB_APP_ID
const installationId = process.env.GITHUB_INSTALLATION_ID; // Replace with your actual Installation ID


// Generate a JWT
function generateJwtToken() {
    const payload = {
      iat: Math.floor(Date.now() / 1000), // Issued at time
      exp: Math.floor(Date.now() / 1000) + (10 * 60), // Expiration time (10 minutes)
      iss: appId
    };
    return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}


// Generate a new token
router.get('/generate-token', async (req, res) => {
    try {
      const jwtToken = generateJwtToken();
      const response = await axios.post(`https://api.github.com/app/installations/${installationId}/access_tokens`, {}, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      console.log(response.data)
      const accessToken = response.data.token;
      res.json({ token: accessToken });
    } catch (error) {
      console.error('Error generating token:', error);
      res.status(500).send('Error generating token');
    }
  });

module.exports = router;
  
