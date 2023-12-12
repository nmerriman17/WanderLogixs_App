const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { searchDatabase } = require('./src/config/db.js');
require('dotenv').config();

// Create express app
const app = express();
app.use(express.json());
app.use(cors());

// Mock data for search results
const mockData = [
    { id: 1, name: 'Trip to Paris' },
    { id: 2, name: 'Hiking in the Alps' },
    // Add more mock data as needed
];


// Routes
const tripRoutes = require('./src/routes/tripRoutes.js');
const expenseRoutes = require('./src/routes/expenseRoutes.js');
const itineraryRoutes = require('./src/routes/itineraryRoutes.js');
const mediaRoutes = require('./src/routes/mediaRoutes.js');
const loginsignupRoutes = require('./src/routes/loginsignupRoutes.js');

const searchRoutes = require('./path/to/searchRoutes.js');
app.use('/api', searchRoutes);

app.get('/api/search', authenticateToken, async (req, res) => {
    try {
        const searchTerm = req.query.term;
        const results = await searchDatabase(searchTerm);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


app.use('/api/trips', tripRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/loginsignup', loginsignupRoutes);

// Database connection
const pool = new Pool({
    user: process.env.DB_USER, 
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

pool.connect()
    .then(() => console.log('Connected to database successfully'))
    .catch(err => console.error('Failed to connect to the database', err));

// Serve static files from the React frontend app's build directory
app.use(express.static(path.join(__dirname, 'Wanderlogixs-Frontend/build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, 'Wanderlogixs-Frontend/build', 'index.html'));
});

// Search endpoint
app.post('/search', (req, res) => {
    const searchTerm = req.body.searchTerm;
    
    // Filter mock data based on search term
    const filteredData = mockData.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    res.json(filteredData);
});


// Start the server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
