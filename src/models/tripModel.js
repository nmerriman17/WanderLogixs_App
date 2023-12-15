const pool = require('../config/db.js'); 

const getAllTrips = async () => {
    const result = await pool.query('SELECT * FROM trips');
    return result.rows;
};

const getTripById = async (tripId) => {
    const result = await pool.query('SELECT * FROM trips WHERE id = $1', [tripId]);
    return result.rows[0];
};

const addTrip = async (tripData) => {
    const { user_id, destination, start_date, end_date, purpose, notes, media_url } = tripData;
    const result = await pool.query(
        'INSERT INTO trips (user_id, destination, start_date, end_date, purpose, notes, media_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [user_id, destination, start_date, end_date, purpose, notes, media_url]
    );
    return result.rows[0];
};

const updateTrip = async (tripId, tripData) => {
    const { destination, start_date, end_date, purpose, notes, media_url } = tripData;
    const result = await pool.query(
        'UPDATE trips SET destination = $1, start_date = $2, end_date = $3, purpose = $4, notes = $5, media_url = $6 WHERE id = $7 RETURNING *',
        [destination, start_date, end_date, purpose, notes, media_url, tripId]
    );
    return result.rows[0];
};

const deleteTrip = async (tripId) => {
    await pool.query('DELETE FROM trips WHERE id = $1', [tripId]);
    return { message: "Trip deleted successfully." };
};

module.exports = {
    getAllTrips,
    getTripById,
    addTrip,
    updateTrip,
    deleteTrip
};
