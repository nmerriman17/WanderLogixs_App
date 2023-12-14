const express = require('express');
const router = express.Router();
const { pool } = require('../config/db.js'); 

router.get('/', async (req, res) => {
    try {
        const searchTerm = `%${req.query.term}%`;

        // Define your queries
        const mediaQuery = `
            SELECT 'media' as source, media_id as id, tripname 
            FROM media 
            WHERE tripname ILIKE $1 OR tags ILIKE $1 OR notes ILIKE $1;
        `;
        const tripsQuery = `
            SELECT 'trip' as source, trip_id as id, destination 
            FROM trips 
            WHERE destination ILIKE $1 OR purpose ILIKE $1 OR notes ILIKE $1;
        `;
        const expensesQuery = `
            SELECT 'expense' as source, expense_id as id, description 
            FROM expenses 
            WHERE category ILIKE $1 OR description ILIKE $1;
        `;
        const itineraryQuery = `
            SELECT 'itinerary' as source, event_id as id, event_name 
            FROM itinerary 
            WHERE event_name ILIKE $1 OR location ILIKE $1 OR description ILIKE $1;
        `;

        // Execute each query and combine results
        const mediaResults = await pool.query(mediaQuery, [searchTerm]);
        const tripsResults = await pool.query(tripsQuery, [searchTerm]);
        const expensesResults = await pool.query(expensesQuery, [searchTerm]);
        const itineraryResults = await pool.query(itineraryQuery, [searchTerm]);

        // Combine all results
        const combinedResults = [
            ...mediaResults.rows,
            ...tripsResults.rows,
            ...expensesResults.rows,
            ...itineraryResults.rows
        ];

        res.json(combinedResults);
    } catch (err) {
        console.error('Error on search API:', err);
        res.status(500).send('Internal Server Error in search route');
    }
});

module.exports = router;
