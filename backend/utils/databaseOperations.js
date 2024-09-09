// databaseOperations.js or similar file
const { Pool } = require('pg');
const { normalizeGameName } = require('./utils/normalize');

const pool = new Pool();

async function insertOrUpdateGame(game) {
  const normalizedGameName = normalizeGameName(game.name);

  await pool.query(`
    INSERT INTO games (name, normalized_name, cover, description) 
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (normalized_name) 
    DO UPDATE SET name = EXCLUDED.name, cover = EXCLUDED.cover, description = EXCLUDED.description
  `, [game.name, normalizedGameName, game.cover, game.description]);
}
