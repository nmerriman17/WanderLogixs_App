const pool = require('../config/db.js'); 

const performSearch = async (searchTerm, userId) => {
    try {
        // Example: Searching in trips and itinerary tables
        const tripQuery = 'SELECT * FROM trips WHERE user_id = $1 AND (destination ILIKE $2 OR notes ILIKE $2)';
        const itineraryQuery = 'SELECT * FROM itinerary WHERE user_id = $1 AND (event_name ILIKE $2 OR location ILIKE $2)';

        const tripResults = await pool.query(tripQuery, [userId, `%${searchTerm}%`]);
        const itineraryResults = await pool.query(itineraryQuery, [userId, `%${searchTerm}%`]);

        return { 
            trips: tripResults.rows, 
            itinerary: itineraryResults.rows 
        };
    } catch (error) {
        console.error('Error in performSearch:', error);
        throw error;
    }
};

module.exports = { performSearch };
