const { Pool } = require('pg');
const pool = new Pool();

async function getGameByNormalizedName(normalizedName) {
  const result = await pool.query(
    `SELECT * FROM games WHERE normalized_name = $1`, 
    [normalizedName]
  );
  return result.rows[0]; // Return the first match
}

module.exports = { getGameByNormalizedName };
