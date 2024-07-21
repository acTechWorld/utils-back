const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Example route to test the connection
router.get('/test-db', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM `licencing-key` WHERE 1');
      res.json(rows);
    } catch (error) {
      console.error('Database connection error:', error);
      res.status(500).send('Database connection error: ' + error);
    }
  });

  module.exports = router;
  