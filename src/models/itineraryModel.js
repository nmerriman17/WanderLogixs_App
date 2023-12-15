const pool = require('../config/db.js'); 

const getAllItineraries = async (userId) => {
    const result = await pool.query('SELECT * FROM itineraries WHERE user_id = $1', [userId]);
    return result.rows;
};

const getItineraryById = async (itineraryId, userId) => {
    const result = await pool.query('SELECT * FROM itineraries WHERE id = $1 AND user_id = $2', [itineraryId, userId]);
    return result.rows[0];
};

const addItinerary = async (itineraryData, userId) => {
    const { eventName, location, startDate, startTime, endDate, endTime, description, notification } = itineraryData;
    const startDateTime = new Date(startDate + ' ' + startTime).toISOString();
    const endDateTime = new Date(endDate + ' ' + endTime).toISOString();
    const result = await pool.query(
        'INSERT INTO itineraries (event_name, location, start_datetime, end_datetime, description, notification, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [eventName, location, startDateTime, endDateTime, description, notification, userId]
    );
    return result.rows[0];
};

const updateItinerary = async (itineraryId, itineraryData, userId) => {
    const { eventName, location, startDate, startTime, endDate, endTime, description, notification } = itineraryData;
    const startDateTime = new Date(startDate + ' ' + startTime).toISOString();
    const endDateTime = new Date(endDate + ' ' + endTime).toISOString();
    const result = await pool.query(
        'UPDATE itineraries SET event_name = $1, location = $2, start_datetime = $3, end_datetime = $4, description = $5, notification = $6 WHERE id = $7 AND user_id = $8 RETURNING *',
        [eventName, location, startDateTime, endDateTime, description, notification, itineraryId, userId]
    );
    return result.rows[0];
};

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
