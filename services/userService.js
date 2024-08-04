const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto-js');
const db = require('../config/db'); // Import the db module

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET
const LOGIN_SECRET_KEY = process.env.LOGIN_SECRET_KEY

function decryptPayload(encryptedValue) {
  const bytes = crypto.AES.decrypt(encryptedValue, LOGIN_SECRET_KEY);
  const decryptedPayload = bytes.toString(crypto.enc.Utf8);
  return JSON.parse(decryptedPayload);
}

router.post('/login', async (req, res) => {
  let { loginEncrypted, passwordEncrypted } = req.body;
  let login;
  let password;
  try {
    const {value: valueLogin, expiredAt: expiredAtLogin} = decryptPayload(loginEncrypted)
    const {value: valuePassword, expiredAt: expiredAtPassword} = decryptPayload(passwordEncrypted)
    if (expiredAtLogin && expiredAtPassword && Date.now() <= expiredAtLogin &&  Date.now() <= expiredAtPassword) {
      login = valueLogin
      password = valuePassword
    } else {
      return res.status(401).json('Keys expired' );
    }
  } catch (error) {
    return res.status(400).send('Invalid credentials encryption' );
  }
  try {
    // Find user by login
    const [rows] = await db.execute('SELECT * FROM users WHERE login = ?', [login]);
    if (rows.length === 0) {
      return res.status(400).send('Invalid credentials');
    }

    const user = rows[0];
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send('Invalid credentials');
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.send({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
})

module.exports = router;