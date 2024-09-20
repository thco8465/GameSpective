const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // Log received data for debugging
    console.log('Sign-up request received with data:', { firstName, lastName, email });

    // Validate input
    if (!firstName || !lastName || !username || !email || !password) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the email is already in use
    const existingEmailUser = await User.findOne({ where: { email } });
    if (existingEmailUser) {
      console.log('Email already in use:', email);
      return res.status(400).json({ error: 'Email is already in use' });
    }

    // Check if the username is already in use
    const existingUsernameUser = await User.findOne({ where: { username } });
    if (existingUsernameUser) {
      console.log('Username already in use:', username);
      return res.status(400).json({ error: 'Username is already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Create a new user
    const newUser = await User.create({
      firstName,
      lastName,
      username,
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
    const { email, username, password } = req.body;
    console.log('Sign-in attempt:', { email, username }); // Log received email and username

    // Determine whether to search by email or username
    const searchCriteria = email ? { email } : { username };
    const user = await User.findOne({ where: searchCriteria });

    if (!user) {
      console.log('User not found');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
