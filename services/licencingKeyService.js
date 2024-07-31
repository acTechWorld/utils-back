const express = require('express');
const router = express.Router();
const licencingKeyRepository = require('../repositories/licencingKeyRepository');

// Example route to test the connection
router.get('/validate-key', async (req, res) => {
  const { licencingKey, project } = req.query;
  try {
    if (!licencingKey || !project) {
      return res.status(400).json({ error: 'params not valid' });
    }

    const result = await licencingKeyRepository.getLicencingKeyById(licencingKey);

    if (!result) {
      return res.status(404).json({ error: 'Licencing key not found' });
    }

    if (result.project !== project) {
      return res.status(400).json({ error: 'project not valid' });
    }

    const { creation_date, duration } = result;

    if (duration) {
      const creationDate = new Date(creation_date);
      const currentDate = new Date();
      const expiryDate = new Date(creationDate.getTime() + duration);

      if (currentDate > expiryDate) {
        return res.status(400).json({ error: 'Licencing key has expired' });
      }
    }

    res.status(200).json(true);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  module.exports = router;
  