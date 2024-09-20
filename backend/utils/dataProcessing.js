const { normalizeGameName } = require('./normalize');
const fetch = require('node-fetch');
const { getValidToken } = require('./twitch_api_utils'); // Import getValidToken

const clientId = process.env.TWITCH_CLIENT_ID;

const fetchAndNormalizeGameNames = async (cursor = null) => {
  try {
    // Get a valid token
    const accessToken = await getValidToken();
    if (!accessToken) {
      throw new Error('No valid access token available');
    }

    // Fetch data from Twitch API
    let url = 'https://api.twitch.tv/helix/games/top';
    if (cursor) {
      url += `?after=${cursor}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    console.log('Twitch API Response Data:', data);

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid data format from Twitch API');
    }

    // Example of normalization
    const games = data.data.map(game => ({
      name: game.name || 'Unknown', // Default to 'Unknown' if name is missing
      normalized_name: normalizeGameName(game.name) || 'Unknown', // Ensure normalized_name is set
      cover: game.box_art_url || '', // Use box_art_url for cover
      description: '' // No description field available
    }));

    // Return data with cursor for pagination if needed
    return {
      games,
      cursor: data.pagination && data.pagination.cursor ? data.pagination.cursor : null
    };
  } catch (error) {
    console.error('Error in fetchAndNormalizeGameNames:', error);
    throw error; // Rethrow error after logging
  }
};

module.exports = { fetchAndNormalizeGameNames };
