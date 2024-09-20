// user.js
const express = require('express');
const router = express.Router();
const { pool } = require('../db'); // Import pool from db.js

const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = { id: decoded.id }; // Set user ID to request object
    next();
  });
};
// Get user information
router.get('/me', authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // Ensure this is correctly set
    //console.log('Fetching data for user ID:', userId); // Log user ID

    const result = await pool.query('SELECT id, "firstName", "username","reviewCount", exp, level FROM "Users" WHERE id = $1', [userId]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      //console.log('User data retrieved:', user); // Log the retrieved user data
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/reviewCount', authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // Ensure this is correctly set
    console.log('Authenticated user ID', userId);
    //console.log('Fetching review count for user ID:', userId); // Log user ID
    // Query to count the number of reviews for the user
    await pool.query(
      'UPDATE "Users" SET "reviewCount" = "reviewCount" + 1 WHERE id = $1',
      [userId]
    );    
    const result = await pool.query(
      'select "reviewCount" from "Users" where id = $1',
      [userId]
    );
    const updateCount = result.rows[0].reviewCount;
    console.log('Updated review count: ', updateCount);

    res.json({ reviewCount: updateCount });
  } catch (error) {
    console.error('Error fetching review count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/exp', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { exp } = req.body; // Amount of experience being added

    // Validate the input
    if (typeof exp !== 'number' || exp < 0) {
      return res.status(400).json({ error: 'Invalid experience value' });
    }

    // Fetch current user data (exp and level)
    const userResult = await pool.query(
      `SELECT exp, level FROM "Users" WHERE id = $1`,
      [userId]
    );
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const totalExp = user.exp + exp; // New total experience
    let newLevel = user.level; // Current level title
    const levels = [
      'Serf', 'Peasant', 'Apprentice', 'Squire', 'Journeyman', 
      'Yeoman', 'Footman', 'Knight', 'Master', 'Captain', 'Baron',
      'Viscount', 'Earl', 'Duke', 'Grandmaster', 'Champion', 'Lord',
      'Lady', 'King', 'Queen', 'Emperor', 'Empress', 'Soverign'
    ]; // Corresponding levels from the enum

    // Calculate new level based on totalExp
    const levelIndex = Math.floor(totalExp / 100); // Every 100 exp corresponds to the next level
    if (levelIndex < levels.length) {
      newLevel = levels[levelIndex]; // Set new level title based on the experience threshold
    } else {
      newLevel = levels[levels.length - 1]; // Max out at the highest level
    }

    // Update experience and level
    const updateResult = await pool.query(
      `UPDATE "Users" SET exp = $1, level = $2 WHERE id = $3 RETURNING exp, level`,
      [totalExp, newLevel, userId]
    );

    res.json(updateResult.rows[0]); // Return the updated exp and level
  } catch (error) {
    console.error('Error updating experience and level:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Get all reviews for authenticated user
router.get('/displayReviews', authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // Get the authenticated user ID
    //console.log('Fetching reviews for user ID:', userId); // Log user ID

    // Query to fetch all reviews for the user
    const result = await pool.query(`
      SELECT reviews.id, reviews.rating, reviews.review, reviews.date, reviews.game_name, games.cover
      FROM reviews
      JOIN games ON similarity(reviews.game_name, games.name) > 0.8
      WHERE reviews.user_id = $1
      ORDER BY reviews.date DESC
    `, [userId]);
    


    const reviews = result.rows; // Get the reviews from the result
    //console.log('Reviews retrieved:', reviews); // Log the retrieved reviews

    if (reviews.length > 0) {
      res.json(reviews);
    } else {
      res.status(404).json({ error: 'No reviews found for this user' });
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Get all accepted friends for a user
router.get('/friends', async (req, res) => {
  const userId = parseInt(req.query.id, 10); // Convert to number
  console.log('user id: ', userId);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  try {
    const query = `
      SELECT f.friend_id, u.username as friend_username, f.status
      FROM friends f
      JOIN "Users" u ON u.id = f.friend_id
      WHERE f.user_id = $1 AND f.status = 'accepted';
    `;
    const values = [userId];

    const result = await pool.query(query, values);

    return res.json(result.rows);
  } catch (error) {
    console.error('Error fetching friends:', error);
    return res.status(500).json({ message: 'Server error while fetching friends.' });
  }
});
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  //console.log('User ID from params:', userId); // Log the userId

  try {
    const result = await pool.query('SELECT * FROM "Users" WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user data: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:userId/reviews', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(`
      SELECT reviews.id, reviews.rating, reviews.review, reviews.date, reviews.game_name, games.cover
      FROM reviews
      JOIN games ON similarity(reviews.game_name, games.name) > 0.8
      WHERE reviews.user_id = $1
      ORDER BY reviews.date DESC
    `, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/search-user', async (req, res) => {
  const { username } = req.query;
  try {
    const result = await pool.query('select id, username from "Users" where username ilike $1', [`%${username}%`]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error searching for user' });
  }
});
router.post('/add-friend', async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    await pool.query('INSERT INTO friends (user_id, friend_id) VALUES ($1, $2)', [userId, friendId]);
    res.json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending friend request' });
  }
});
router.get('/friend-status', async (req, res) => {
  const { userId, friendId } = req.query;
  try {
    const result = await pool.query('SELECT status FROM friends WHERE user_id = $1 AND friend_id = $2', [userId, friendId]);
    res.json(result.rows[0] || { status: 'not_friends' });
  } catch (error) {
    res.status(500).json({ error: 'Error checking friendship status' });
  }
});
router.get('/friends/sent', async (req, res) => {
  const userId = req.query.id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const result = await pool.query(
      `SELECT 
          u2.username AS friend_username,
          f.status,
          f.friend_id AS friend_id
      FROM 
          friends f
      JOIN 
          "Users" u2 ON f.friend_id = u2.id
      WHERE 
          f.user_id = $1`,  // Filtering where the logged-in user is the sender
      [userId]
    );
    //console.log('Sent friend requests retrieved:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sent friend requests:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/friends/received', async (req, res) => {
  const userId = req.query.id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const result = await pool.query(
      `SELECT 
          u.username AS friend_username,
          f.status,
          f.user_id AS friend_id
      FROM 
          friends f
      JOIN 
          "Users" u ON f.user_id = u.id
      WHERE 
          f.friend_id = $1`,  // Filtering where the logged-in user is the recipient
      [userId]
    );
    //console.log('Received friend requests retrieved:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching received friend requests:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Accept friend request
router.post('/friends/accept', async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    // Update the friend request status to 'accepted'
    const query = `
      UPDATE friends
      SET status = 'accepted'
      WHERE user_id = $1 AND friend_id = $2 AND status = 'pending'
      RETURNING *;
    `;
    const values = [friendId, userId];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Friend request not found or already processed.' });
    }

    return res.json({ message: 'Friend request accepted.', data: result.rows[0] });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return res.status(500).json({ message: 'Server error while accepting friend request.' });
  }
});
// routes/friends.js
router.post('/friends/decline', async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    // Update the friend request status to 'declined'
    const query = `
      UPDATE friends
      SET status = 'declined'
      WHERE user_id = $1 AND friend_id = $2 AND status = 'pending'
      RETURNING *;
    `;
    const values = [friendId, userId];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Friend request not found or already processed.' });
    }

    return res.json({ message: 'Friend request declined.', data: result.rows[0] });
  } catch (error) {
    console.error('Error declining friend request:', error);
    return res.status(500).json({ message: 'Server error while declining friend request.' });
  }
});

module.exports = router;
