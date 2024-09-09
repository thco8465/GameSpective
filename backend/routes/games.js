const express = require('express');
const router = express.Router();
const { pool } = require('../db'); // Import pool from db.js
const { insertOrUpdateGame } = require('./utils/databaseOperations');
const { fetchAndNormalizeGameNames } = require('./utils/dataProcessing');
const { normalizeGameName } = require('./utils/normalize');


router.get('/games', async (req, res) => {
  try {
    // Execute a SQL query to fetch all games
    const result = await pool.query('SELECT id, name, description FROM "Games"'); // Adjust column names if needed

    // Check if any rows are returned
    if (result.rows.length > 0) {
      console.log('Games data retrieved:', result.rows); // Log the retrieved games data
      res.json(result.rows); // Send the games data as a JSON response
    } else {
      res.status(404).json({ error: 'No games found' });
    }
  } catch (error) {
    console.error('Error fetching games data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/games', async (req, res) => {
  try {
    const game = req.body; // Ensure to validate and sanitize input
    await insertOrUpdateGame(game);
    res.status(201).json({ message: 'Game added or updated successfully' });
  } catch (error) {
    console.error('Error processing game:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/fetch-games', async (req, res) => {
  try {
    const games = await fetchAndNormalizeGameNames();
    res.json(games);
  } catch (error) {
    console.error('Error fetching and processing game names:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
