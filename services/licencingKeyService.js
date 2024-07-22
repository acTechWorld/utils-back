const express = require('express');
const router = express.Router();
const licencingKeyRepository = require('../repositories/licencingKeyRepository');

// Example route to test the connection
router.get('/validate-key', async (req, res) => {
  const { id, project } = req.params;
  try {
    const result = await licencingKeyRepository.getLicencingKeyById(id);
    if (!result) return res.status(404).json({ error: 'Licencing key not found' });
    else if(result.project !== project) return res.status(400).json({ error: 'Licencing key not valid' });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

  module.exports = router;
  