const { fetchAndNormalizeGameNames } = require('./dataProcessing');
const { insertOrUpdateGame } = require('./databaseOperations');
require('dotenv').config();
async function populateGamesTable() {
  console.trace('populdateGamesTable called');
  let cursor = null;
  let totalGames = 0;

  do {
    // Fetch and normalize a batch of games
    const { games, cursor: newCursor } = await fetchAndNormalizeGameNames(cursor);
    
    // Insert the games into the database
    await insertOrUpdateGame(games);
    
    totalGames += games.length;
    cursor = newCursor; // Update the cursor for the next batch

    console.log(`Inserted ${totalGames} games so far...`);
  } while (cursor && totalGames < 1);

  console.log('Successfully populated the games table with all Twitch games!');
}
if (process.env.POPULATE_GAMES === 'true') {
  populateGamesTable().catch(console.error);
}
