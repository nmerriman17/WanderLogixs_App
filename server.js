const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Database connection setup
let poolConfig = {};

if (process.env.NODE_ENV === 'production') {
    // Heroku PostgreSQL configuration
    poolConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    };
} else {
    // Local database configuration
    poolConfig = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT
    };
}

const pool = new Pool(poolConfig);

// Verify database connection
pool.connect()
    .then(() => console.log('Connected to database successfully'))
    .catch(err => {
        console.error('Failed to connect to the database', err);
        process.exit(1);
    });
// Import route handlers
const searchRoutes = require('./src/routes/searchRoutes.js');
const tripRoutes = require('./src/routes/tripRoutes.js');
const expenseRoutes = require('./src/routes/expenseRoutes.js');
const itineraryRoutes = require('./src/routes/itineraryRoutes.js');
const mediaRoutes = require('./src/routes/mediaRoutes.js');
const loginsignupRoutes = require('./src/routes/loginsignupRoutes.js');

// Create express app
const app = express();
app.use(express.json());
app.use(cors());


// API Routes
app.use('/api', searchRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api', loginsignupRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

// Serve static files from the React frontend app's build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
