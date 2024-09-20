const express = require('express');
const { pool } = require('../db'); // Import pool from db.js
const router = express.Router();

router.post('/review', async (req, res) => {
  const { gameId, game_name, userId, review, timeSpent, rating, date } = req.body;

  // Validate required fields and their types
  if (typeof gameId !== 'string' || typeof game_name !== 'string' || typeof userId !== 'number' || typeof review !== 'string' ||
    typeof timeSpent !== 'string' || typeof rating !== 'number' || typeof date !== 'string') {

    console.error('Invalid input data:', { gameId, game_name, userId, review, timeSpent, rating, date });
    return res.status(400).json({ error: 'Invalid input data', details: { gameId, userId, review, timeSpent, rating, date } });
  }

  // Validate rating
  if (rating < 1 || rating > 10) {
    console.error('Invalid rating:', rating);
    return res.status(400).json({ error: 'Rating must be between 1 and 10', details: { rating } });
  }

  // Convert and validate date
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    console.error('Invalid date format:', date);
    return res.status(400).json({ error: 'Invalid date format', details: { date } });
  }

  // Convert gameId and timeSpent to integers
  const gameIdInt = parseInt(gameId, 10);
  const timeSpentInt = parseInt(timeSpent, 10);

  try {
    // Insert review into database
    const result = await pool.query(
      'INSERT INTO reviews (game_id, game_name,user_id, review, time_spent, rating, date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [gameIdInt, game_name, userId, review, timeSpentInt, rating, parsedDate.toISOString()] // Format date as ISO string
    );

    // Respond with the inserted review
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/review/in-depth', async(req, res) => {
  const { review_id, high, low, atmosphere, story, dev_note, gameplay, difficulty } = req.body;
  // Validate required fields and their types
  if (typeof review_id !== 'number' || typeof high !== 'string' || typeof low !== 'string' || typeof atmosphere !== 'number' ||
    typeof story !== 'number' || typeof dev_note !== 'string' || typeof gameplay !== 'number' || typeof difficulty !== 'number') {
      console.error('Invalid input data:', { review_id, high, low, atmosphere, story, dev_note, gameplay, difficulty });
      return res.status(400).json({ error: 'Invalid input data', details: { review_id, high, low, atmosphere, story, dev_note, gameplay, difficulty} });
  }
  // Convert to integers
  const review_id_Int = parseInt(review_id, 10);
  const atmosphereInt = parseInt(atmosphere, 10);
  const storyInt = parseInt(story, 10);
  const gameplayInt = parseInt(gameplay, 10);
  const difficultyInt = parseInt(difficulty, 10);

  try {
    // Insert review into database
    const result = await pool.query(
      'INSERT INTO review_info (review_id, high,low, atmosphere, story, dev_note, gameplay, difficulty) VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING *',
      [review_id, high, low, atmosphereInt, storyInt, dev_note, gameplayInt, difficultyInt] // Format date as ISO string
    );

    // Respond with the inserted review
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/review/in-depth/:review_id', async (req, res) => {
  const { review_id } = req.params;
  console.log('Received request for review ID:', review_id);

  try {
      const query = `
      SELECT r.*, games.cover, reviews.game_name
      FROM review_info r
      JOIN reviews ON r.review_id = reviews.id
      JOIN games ON reviews.game_name = games.name
      WHERE reviews.id = $1`;
      
      const { rows } = await pool.query(query, [review_id]);
      console.log('Rows: ', rows);
      if (rows.length === 0) {
          return res.status(404).json({ error: 'Review not found' });
      }

      console.log('Review found:', rows);
      res.status(200).json(rows[0]); // Return the first result
  } catch (error) {
      console.error('Error fetching review info: ', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/reviews/user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const query = `
        SELECT r.*, games.cover
        FROM reviews r
        JOIN "Users" u ON r.user_id = u.id
        join games on r.game_name = games.name
        WHERE u.username = $1
      `;
    const { rows } = await pool.query(query, [username]);
    console.log(rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching reviews by user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/reviews/game/:game', async (req, res) => {
  const { game } = req.params;

  try {
    const query = `
      SELECT reviews.*, games.cover
      FROM reviews
      JOIN games ON reviews.game_name = games.name
      WHERE reviews.game_name = $1
    `;

    const { rows } = await pool.query(query, [game]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching reviews by game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/recentReviews', async (req, res) => {
  try {
    const query =
      `SELECT 
      reviews.id,
      reviews.rating,
      reviews.review,
      reviews.date,
      reviews.time_spent,
      games.cover,
      "Users".username
      FROM reviews
      JOIN games ON reviews.game_name = games.name
      JOIN "Users" ON reviews.user_id = "Users".id
      ORDER BY reviews.date DESC
      LIMIT 10;
`;
    const { rows } = await pool.query(query);
    console.log(rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching recent reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})


module.exports = router;
