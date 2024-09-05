const express = require('express');
const router = express.Router();
const { Game } = require('../models');

router.get('/games', async (req, res) => {
  try {
    const games = await Game.findAll();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching games' });
  }
});

router.post('/games', async (req, res) => {
  try {
    const { title, description } = req.body;
    const newGame = await Game.create({ title, description });
    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ error: 'Error creating game' });
  }
});

module.exports = router;
