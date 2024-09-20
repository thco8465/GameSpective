// index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const gameRoutes = require('./routes/games');
const authRoutes = require('./routes/authRoutes');
const twitchAPI = require('./routes/twitch_api');
const userRoutes = require('./routes/user');
const reviews = require('./routes/review');

const app = express();
const PORT = process.env.PORT || 5000;

app.options('*', cors()); // Enable pre-flight requests for all routes

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://gamespective.onrender.com',
      'https://gamespective.loca.lt',
      'https://gamespectivebackend.onrender.com/',
      'http://127.0.0.1:5173',
      'http://localhost:5000',
      'http://localhost:5000/api/review',
      'https://gamespective.loca.lt/api/review',
      'https://gamespective.loca.lt/api/twitch_api/games?name=',
      'https://gamespective.loca.lt',
      'https://gamespective.loca.lt/api/user/me',
      'https://gamespective.loca.lt/api/user/displayReviews',
      'https://gamespective.loca.lt/api/user/reviewCount',
      'https://gamespective.loca.lt/api/games',
      'https://gamespective.loca.lt/api/games/search-games',
    ];

    console.log('Requested Origin:', origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('Origin not allowed:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(bodyParser.json());
app.use('/api/games', gameRoutes);
app.use('/api/authRoutes', authRoutes);
app.use('/api/twitch_api', twitchAPI);
app.use('/api/user', userRoutes);
app.use('/api/review', reviews);


app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
