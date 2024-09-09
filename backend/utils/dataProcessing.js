// dataProcessing.js or similar file
const { normalizeGameName } = require('./utils/normalize');

async function fetchAndNormalizeGameNames() {
  const response = await fetch('https://api.twitch.tv/helix/games');
  const data = await response.json();

  // Example processing of fetched game names
  const games = data.data.map(game => {
    return {
      name: game.name,
      normalized_name: normalizeGameName(game.name),
      cover: game.cover_url, // Example field
      description: game.description // Example field
    };
  });

  return games;
}
