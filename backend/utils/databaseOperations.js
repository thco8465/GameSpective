// databaseOperations.js or similar file
const { pool } = require('../db');
const format = require('pg-format'); // Ensure this is installed and imported

// Function to insert or update a game
const insertOrUpdateGame = async (games) => {
  try {
    // Create an array of game values for bulk insert/update
    const values = games.map(game => [
      game.name, 
      game.normalized_name, 
      game.cover, 
      game.description,
      new Date(), // Set created_at to current date
      new Date()  // Set updated_at to current date
    ]);

    // Create a SQL query with placeholders
    const query = format(`
      INSERT INTO games (name, normalized_name, cover, description, created_at, updated_at) 
      VALUES %L
      ON CONFLICT (name) 
      DO UPDATE
      SET 
        normalized_name = EXCLUDED.normalized_name,
        cover = EXCLUDED.cover,
        description = EXCLUDED.description,
        updated_at = EXCLUDED.updated_at
    `, values);

    // Execute the query
    await pool.query(query);
    console.log('Games inserted or updated successfully.');
  } catch (error) {
    console.error('Error inserting or updating games:', error);
    throw error; // Rethrow error after logging
  }
};

module.exports = { insertOrUpdateGame };
