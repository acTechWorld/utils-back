// repository.js
const db = require('../config/db');

// Create a new licencing key entry
const createLicencingKey = async (email, project, licencing_key, duration) => {
    const query = 'INSERT INTO `licencing_keys` (email, project, licencing_key, creation_date, duration) VALUES (?, ?, ?, current_timestamp(), ?)';
    const [results] = await db.execute(query, [email, project, licencing_key, duration]);
    return results;
};

// Read all licencing key entries
const getLicencingKeys = async () => {
    const query = 'SELECT * FROM `licencing_keys`';
    const [results] = await db.execute(query);
    return results;
};

const findLicencingKeyByEmailProject = async (email, project) => {
    const query = `
        SELECT * FROM licencing_keys 
        WHERE  email = ? AND project = ?
    `;
    const [results] = await db.execute(query, [email, project]);
    return results;
}

// Read a single licencing key entry by ID
const getLicencingKeyById = async (licencing_key) => {
    const query = 'SELECT * FROM `licencing_keys` WHERE licencing_key = ?';
    const [results] = await db.execute(query, [licencing_key]);
    return results[0];
};

// Update a licencing key entry
const updateLicencingKey = async (licencing_key, project, duration) => {
    const query = 'UPDATE `licencing_keys` SET project = ?, licencing_key = ?, duration = ? WHERE licencing_key = ?';
    const [results] = await db.execute(query, [project, licencing_key, duration, licencing_key]);
    return results;
};

// Delete a licencing key entry
const deleteLicencingKey = async (licencing_key) => {
    const query = 'DELETE FROM `licencing_keys` WHERE licencing_key = ?';
    const [results] = await db.execute(query, [licencing_key]);
    return results;
};

module.exports = {
    createLicencingKey,
    getLicencingKeys,
    getLicencingKeyById,
    updateLicencingKey,
    deleteLicencingKey,
    findLicencingKeyByEmailProject
};
