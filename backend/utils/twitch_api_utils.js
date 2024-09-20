// twitch_api_utils.js
const fetch = require('node-fetch');
const fs = require('fs');
require('dotenv').config();

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const tokenFilePath = '../twitchToken.json'; // Path to store token and expiry

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

module.exports = { getValidToken, getAccessToken };
