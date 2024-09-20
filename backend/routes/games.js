const express = require('express');
const router = express.Router();
const { pool } = require('../db'); // Import pool from db.js
const { insertOrUpdateGame } = require('../utils/databaseOperations');
const { fetchAndNormalizeGameNames } = require('../utils/dataProcessing');
const { populateGamesTable } = require('../utils/populateGames'); // New import for populating the games table
const { normalizeGameName } = require('../utils/normalize');
const { getValidToken } = require('../utils/twitch_api_utils'); // Import getValidToken

// GET route to retrieve all games from the database
router.get('/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, normalized_name, cover, description FROM games');
    if (result.rows.length > 0) {
      console.log('Games data retrieved:', result.rows);
      res.json(result.rows);
    } else {
      res.status(404).json({ error: 'No games found' });
    }
  } catch (error) {
    console.error('Error fetching games data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// In your game routes file (e.g., gameRoutes.js)

router.get('/search-games', async (req, res) => {
  try {
    const searchTerm = req.query.name; // Get the search term from query parameters

    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required' });
    }

    const query = `
      SELECT id, name, cover
      FROM games
      WHERE name ILIKE $1
      LIMIT 10;`; // Using ILIKE for case-insensitive search

    const result = await pool.query(query, [`%${searchTerm}%`]);

    if (result.rows.length > 0) {
      console.log('Search results:', result.rows);
      res.json(result.rows);
    } else {
      res.status(404).json({ error: 'No games found' });
    }
  } catch (error) {
    console.error('Error searching games:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// POST route to add or update a game in the database
router.post('/games', async (req, res) => {
  try {
    const game = req.body; // Ensure to validate and sanitize input
    game.name = normalizeGameName(game.name); // Normalize game name
    await insertOrUpdateGame(game);
    res.status(201).json({ message: 'Game added or updated successfully' });
  } catch (error) {
    console.error('Error processing game:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET route to fetch and normalize game names from Twitch API
router.get('/fetch-games', async (req, res) => {
  try {
    const accessToken = await getValidToken(); // Ensure we have a valid token

    if (!accessToken) {
      return res.status(500).json({ error: 'Could not get access token' });
    }

    const games = await fetchAndNormalizeGameNames(accessToken); // Pass token to fetchAndNormalizeGameNames
    res.json(games);
  } catch (error) {
    console.error('Error fetching and processing game names:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST route to populate the games table by fetching games from Twitch API and inserting into the database
router.post('/populate-games', async (req, res) => {
  try {
    await populateGamesTable(); // Call the populateGamesTable function to update the games table
    res.status(201).json({ message: 'Games table populated successfully' });
  } catch (error) {
    console.error('Error populating games table:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
