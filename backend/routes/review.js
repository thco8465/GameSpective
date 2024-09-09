const express = require('express');
const { pool } = require('../db'); // Import pool from db.js
const router = express.Router();

router.post('/api/reviews', async (req, res) => {
    const { gameId, userId, review, timeSpent, rating, date } = req.body;
  
    try {
      const result = await pool.query(
        'INSERT INTO reviews (game_id, user_id, review, time_spent, rating, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [gameId, userId, review, timeSpent, rating, date]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error inserting review:', error);
      res.status(500).send('Server error');
    }
  });
  
module.exports = router;
