const pool = require('../config/db.js');
const s3Upload = require('../config/s3Upload');

const getAllTrips = async (userId) => {
    try {
        const result = await pool.query('SELECT * FROM trips WHERE user_id = $1', [userId]);
        return result.rows;
    } catch (error) {
        console.error('Error in getAllTrips:', error);
        throw error;
    }
};

const getTripById = async (tripId, userId) => {
    try {
        const result = await pool.query('SELECT * FROM trips WHERE trip_id = $1 AND user_id = $2', [tripId, userId]);
        return result.rows[0];
    } catch (error) {
        console.error('Error in getTripById:', error);
        throw error;
    }
};

const addTrip = async (tripData, userId) => {
    let fileKey = null;
    if (tripData.file) {
        const uploadResult = await s3Upload.uploadFileToS3(tripData.file);
        fileKey = uploadResult.fileKey;
    }

    const query = 'INSERT INTO trips (destination, start_date, end_date, purpose, notes, file_key, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [tripData.destination, tripData.startDate, tripData.endDate, tripData.purpose, tripData.notes, fileKey, userId];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error in addTrip:', error);
        throw error;
    }
};

const updateTrip = async (tripId, tripData, userId) => {
    let fileKey = tripData.fileKey;

    if (tripData.file) {
        const uploadResult = await s3Upload.uploadFileToS3(tripData.file);
        fileKey = uploadResult.fileKey;
    }

    const query = `
        UPDATE trips
        SET destination = $1, start_date = $2, end_date = $3, purpose = $4, notes = $5, file_key = $6
        WHERE trip_id = $7 AND user_id = $8
        RETURNING *;
    `;
    const values = [tripData.destination, tripData.startDate, tripData.endDate, tripData.purpose, tripData.notes, fileKey, tripId, userId];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error in updateTrip:', error);
        throw error;
    }
};

const deleteTrip = async (tripId, userId) => {
    const trip = await getTripById(tripId, userId);
    if (trip && trip.file_key) {
        await s3Upload.deleteFileFromS3(trip.file_key);
    }

    const query = 'DELETE FROM trips WHERE trip_id = $1 AND user_id = $2 RETURNING *';
    const values = [tripId, userId];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error in deleteTrip:', error);
        throw error;
    }
};

module.exports = { getAllTrips, getTripById, addTrip, updateTrip, deleteTrip };
