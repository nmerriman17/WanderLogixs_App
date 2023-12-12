const pool = require('../config/db.js'); 

// Get all itineraries for a specific user
const getAllItineraries = async (userId) => {
    const result = await pool.query('SELECT * FROM itineraries WHERE user_id = $1', [userId]);
    return result.rows;
};

// Get a specific itinerary by ID for a user
const getItineraryById = async (itineraryId, userId) => {
    const result = await pool.query('SELECT * FROM itineraries WHERE id = $1 AND user_id = $2', [itineraryId, userId]);
    return result.rows[0];
};

// Add a new itinerary for a user
const addItinerary = async (itineraryData, userId) => {
    const { eventName, location, startDate, startTime, endDate, endTime, description, notification } = itineraryData;
    const startDateTime = new Date(startDate + 'T' + startTime).toISOString();
    const endDateTime = new Date(endDate + 'T' + endTime).toISOString();

    const result = await pool.query(
        'INSERT INTO itineraries (event_name, location, start_datetime, end_datetime, description, notification, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [eventName, location, startDateTime, endDateTime, description, notification, userId]
    );
    return result.rows[0];
};

// Update an existing itinerary for a user
const updateItinerary = async (itineraryId, itineraryData, userId) => {
    const { eventName, location, startDate, startTime, endDate, endTime, description, notification } = itineraryData;
    const startDateTime = new Date(startDate + 'T' + startTime).toISOString();
    const endDateTime = new Date(endDate + 'T' + endTime).toISOString();
    
    const query = `
    UPDATE itineraries
    SET 
        event_name = $1,
        location = $2,
        start_datetime = $3,
        end_datetime = $4,
        description = $5,
        notification = $6
    WHERE 
        id = $7 AND user_id = $8
    RETURNING *;
`;

try {
    // Executing the query
    const result = await pool.query(query, [eventName, location, startDate, endDate, description, notification, itineraryId, userId]);
    
    // If no rows are returned, it means either the itinerary doesn't exist or doesn't belong to the user
    if (result.rows.length === 0) {
        return null;
    }

    // Returning the updated itinerary
    return result.rows[0];
} catch (error) {
    throw new Error(`Unable to update itinerary: ${error.message}`);
}
};


// Delete a specific itinerary for a user
const deleteItinerary = async (itineraryId, userId) => {
    const result = await pool.query('DELETE FROM itineraries WHERE id = $1 AND user_id = $2 RETURNING *', [itineraryId, userId]);
    return result.rows[0];
};

module.exports = {
    getAllItineraries,
    getItineraryById,
    addItinerary,
    updateItinerary,
    deleteItinerary
};
