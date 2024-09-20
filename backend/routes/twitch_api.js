// twitch_api.js
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { getValidToken } = require('../utils/twitch_api_utils'); // Import functions from utils

const clientId = process.env.TWITCH_CLIENT_ID;

router.get('/games', async (req, res) => {
  console.log('Inside /games - Fetching game data...');
  const gameName = req.query.name;

  if (!gameName) {
    return res.status(400).json({ error: 'Game name is required' });
  }

  try {
    const accessToken = await getValidToken(); // Ensure we have a valid token

    if (!accessToken) {
      return res.status(500).json({ error: 'Could not get access token' });
    }

    const response = await fetch(`https://api.twitch.tv/helix/games?name=${gameName}`, {
      method: 'GET',
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420' // Add this header to skip ngrok warning
      },
    });

    const data = await response.json();
    console.log('Twitch API Response Body:', data); // Debugging

    if (data.data.length > 0) {
      const game = data.data[0];
      const gameId = game.id;
      const gameTitle = game.name;
      const coverImage = game.box_art_url.replace('{width}', '300').replace('{height}', '400');
      res.json({gameId: gameId, title: gameTitle, cover: coverImage });
    } else {
      res.status(404).json({ error: 'Game not found' });
    }
  } catch (error) {
    console.error('Error fetching game data:', error);
    res.status(500).json({ error: 'Error fetching game data' });
  }
});

module.exports = router;
