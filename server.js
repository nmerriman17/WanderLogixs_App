const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { searchDatabase } = require('./src/config/db.js');
require('dotenv').config();


// Database connection setup
//const pool = new Pool({
  //  user: process.env.DB_USER, 
    //host: process.env.DB_HOST,
    //database: process.env.DB_NAME,
    //password: process.env.DB_PASS,
    //port: process.env.DB_PORT,
//});

const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Heroku
    }
};

const pool = new Pool(poolConfig);

// Verify database connection
pool.connect()
    .then(() => console.log('Connected to database successfully'))
    .catch(err => console.error('Failed to connect to the database', err));

// Import route handlers
const tripRoutes = require('./src/routes/tripRoutes.js');
const expenseRoutes = require('./src/routes/expenseRoutes.js');
const itineraryRoutes = require('./src/routes/itineraryRoutes.js');
const mediaRoutes = require('./src/routes/mediaRoutes.js');
const loginsignupRoutes = require('./src/routes/loginsignupRoutes.js');
const searchRoutes = require('./src/routes/searchRoutes.js'); // Ensure correct path

// Create express app
const app = express();
app.use(express.json());
app.use(cors());

// Register user
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, hashedPassword]);
        const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET);
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login user
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            const isValid = await bcrypt.compare(password, result.rows[0].password);
            if (isValid) {
                const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET);
                res.json({ token });
            } else {
                res.status(400).json({ message: 'Invalid email or password' });
            }
        } else {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in user' });
    }
});


// API Routes
app.use('/api/trips', tripRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api', loginsignupRoutes);
app.use('/api/search', searchRoutes);

// Serve static files from the React frontend app's build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});




// Start the server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
