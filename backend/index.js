require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const gameRoutes = require('./routes/game');
const authRoutes = require('./routes/authRoutes'); // Adjust the path as necessary

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', gameRoutes);
app.use('/api/authRoutes', authRoutes);

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