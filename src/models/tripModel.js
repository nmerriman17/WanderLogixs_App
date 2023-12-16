const pool = require('../config/db.js'); // Ensure the path is correct

const getTripsByUserId = async (userId) => {
    const query = 'SELECT * FROM trips WHERE user_id = $1';
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows;
};

const getTripById = async (tripId, userId) => {
    const query = 'SELECT * FROM trips WHERE trip_id = $1 AND user_id = $2';
    const values = [tripId, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const createTrip = async (tripData, userId) => {
    const { destination, start_date, end_date, purpose, notes, file_key } = tripData;
    const query = 'INSERT INTO trips (destination, start_date, end_date, purpose, notes, file_key, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [destination, start_date, end_date, purpose, notes, file_key, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const updateTrip = async (tripId, tripData, userId) => {
    const { destination, start_date, end_date, purpose, notes, file_key } = tripData;
    const query = 'UPDATE trips SET destination = $1, start_date = $2, end_date = $3, purpose = $4, notes = $5, file_key = $6 WHERE trip_id = $7 AND user_id = $8 RETURNING *';
    const values = [destination, start_date, end_date, purpose, notes, file_key, tripId, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteTrip = async (tripId, userId) => {
    const query = 'DELETE FROM trips WHERE trip_id = $1 AND user_id = $2 RETURNING *';
    const values = [tripId, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
};

module.exports = {
    getTripsByUserId,
    getTripById,
    createTrip,
    updateTrip,
    deleteTrip
};
