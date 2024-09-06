require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const gameRoutes = require('./routes/game');
const authRoutes = require('./routes/authRoutes'); // Adjust the path as necessary
const twitchAPI = require('./routes/twitch_api');

const app = express();
const PORT = process.env.PORT || 5000;
app.options('*', cors()); // Enable pre-flight requests for all routes

// CORS configuration with logging
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://yellow-radios-knock.loca.lt/api/twitch_api/games?name=Fortnite',
      'https://yellow-radios-knock.loca.lt'
    ];
    
    console.log('Requested Origin:', origin); // Log the origin

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('Origin not allowed:', origin); // Log if origin is not allowed
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(bodyParser.json());
app.use('/api', gameRoutes);
app.use('/api/authRoutes', authRoutes);
app.use('/api/twitch_api', twitchAPI);

// Database configuration
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DATABASE_USERNAME,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})