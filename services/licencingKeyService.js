const express = require('express');
const router = express.Router();
const licencingKeyRepository = require('../repositories/licencingKeyRepository');
const validateToken  = require('../utils/token')

// Example route to test the connection
router.get('/validate-key', async (req, res) => {
  const { licencingKey, project } = req.query;
  try {
    if(!licencingKey || !project) {
      res.status(400).json({ error: 'params not valid' });
    } else {
      const result = await licencingKeyRepository.getLicencingKeyById(licencingKey);
      if (!result) res.status(404).json({ error: 'Licencing key not found' });
      else if(result.project !== project) res.status(400).json({ error: 'project not valid' });
      else {
        res.status(200).json(true);
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  module.exports = router;
  