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
      console.log('Fetching data for user ID:', userId); // Log user ID
  
      const result = await pool.query('SELECT "firstName", "reviewCount", exp, level FROM "Users" WHERE id = $1', [userId]);
  
      if (result.rows.length > 0) {
        const user = result.rows[0];
        console.log('User data retrieved:', user); // Log the retrieved user data
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

module.exports = router;
