const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db'); // Import the db module

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET

router.post('/login', async (req, res) => {
    const { login, password } = req.body;
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