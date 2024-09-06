const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
require('dotenv').config();
// fs.writeFileSync(testFilePath, 'Test content');
// console.log('Test file written:', fs.readFileSync(testFilePath, 'utf8'));
// fs.unlinkSync(testFilePath);

// Your Twitch credentials
const clientId = '8wy1w7ylxpdrip2fejm25dw7qxcn94';
const clientSecret = 'nyweofhpprx70t0prictm262xa37j2';

const tokenFilePath = './twitchToken.json'; // A file to store token and expiry

// Function to get access token
const getAccessToken = async () => {
  try {
    console.log('Fetching new access token...');
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    });
    const data = await response.json();

    console.log('Access token response:', data);

    // Store the token and expiry time in a file
    const tokenData = {
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000, // Convert expiry time from seconds to milliseconds
    };
    fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData, null, 2));
    console.log('Access token saved to file.');

    return tokenData.accessToken;
  } catch (error) {
    console.error('Error fetching access token:', error);
    return null;
  }
};

// Function to get a valid token
const getValidToken = async () => {
  console.log('Checking for valid token...');
  if (fs.existsSync(tokenFilePath)) {
    const tokenData = JSON.parse(fs.readFileSync(tokenFilePath, 'utf8'));
    console.log('Token data from file:', tokenData);

    if (Date.now() < tokenData.expiresAt) {
      console.log('Token is still valid.');
      return tokenData.accessToken; // Token is still valid
    }
  }

  // Token has expired or doesn't exist, fetch a new one
  console.log('Token is expired or does not exist, fetching new token...');
  return await getAccessToken();
};
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
      const gameTitle = game.name;
      const coverImage = game.box_art_url.replace('{width}', '300').replace('{height}', '400');
      res.json({ title: gameTitle, cover: coverImage });
    } else {
      res.status(404).json({ error: 'Game not found' });
    }
  } catch (error) {
    console.error('Error fetching game data:', error);
    res.status(500).json({ error: 'Error fetching game data' });
  }
});



//Route to fetch game data
// router.get('/games', async (req, res) => {
//   console.log('Inside /games - Fetching game data...');
//   const gameName = req.query.name;

//   if (!gameName) {
//     return res.status(400).json({ error: 'Game name is required' });
//   }

//   try {
//     const accessToken = await getValidToken(); // Ensure we have a valid token

//     if (!accessToken) {
//       return res.status(500).json({ error: 'Could not get access token' });
//     }

//     const response = await fetch(`https://api.twitch.tv/helix/games?name=${gameName}`, {
//       method: 'GET',
//       headers: {
//         'Client-ID': clientId,
//         'Authorization': `Bearer ${accessToken}`,
//       },
//     });

//     const data = await response.json();
//     console.log('Twitch API Response Body:', data); // Debugging

//     if (data.data.length > 0) {
//       const game = data.data[0];
//       const gameTitle = game.name;
//       const coverImage = game.box_art_url.replace('{width}', '300').replace('{height}', '400');
//       res.json({ title: gameTitle, cover: coverImage });
//     } else {
//       res.status(404).json({ error: 'Game not found' });
//     }
//   } catch (error) {
//     console.error('Error fetching game data:', error);
//     res.status(500).json({ error: 'Error fetching game data' });
//   }
// });


module.exports = router;

// Example usage (for debugging purposes)
// (You can remove this part if it's not needed in production)
// fetchGameData('Overwatch');
