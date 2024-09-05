const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Signup route
router.post('/signup', async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
  
      // Log received data for debugging
      console.log('Sign-up request received with data:', { firstName, lastName, email });
  
      // Validate input
      if (!firstName || !lastName || !email || !password) {
        console.log('Validation failed: Missing required fields');
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Check if the email is already in use
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        console.log('Email already in use:', email);
        return res.status(400).json({ error: 'Email is already in use' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Password hashed successfully');
  
      // Create a new user
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      console.log('New user created:', newUser);
  
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
// Signin route
router.post('/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('Sign-in attempt:', { email }); // Log received email
  
      const user = await User.findOne({ where: { email } });
      if (!user) {
        console.log('User not found');
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password mismatch');
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error) {
      console.error('Internal server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

module.exports = router;
