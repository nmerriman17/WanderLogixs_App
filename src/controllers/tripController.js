const TripModel = require('../models/tripModel');
const s3Upload = require('../config/s3Upload');

const getTrips = async (req, res) => {
    try {
        const userId = req.userId;
        const trips = await TripModel.getAllTrips(userId);
        res.json(trips);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getTripById = async (req, res) => {
    try {
        const tripId = req.params.id;
        const userId = req.userId;
        const trip = await TripModel.getTripById(tripId, userId);
        if (!trip) {
            return res.status(404).send('Trip not found');
        }
        res.json(trip);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createTrip = async (req, res) => {
    try {
        const userId = req.userId;
        let file = null;
        if (req.file) {
            file = req.file;
        }
        const newTrip = await TripModel.addTrip({ ...req.body, file }, userId);
        res.status(201).json(newTrip);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateTrip = async (req, res) => {
    try {
        const tripId = req.params.id;
        const userId = req.userId;
        const existingTrip = await TripModel.getTripById(tripId, userId);
        if (!existingTrip) {
            return res.status(404).send('Trip not found');
        }

        let file = null;
        if (req.file) {
            // Delete existing file from S3
            if (existingTrip.file_key) {
                await s3Upload.deleteFileFromS3(existingTrip.file_key);
            }
            file = req.file;
        }

        const updatedTrip = await TripModel.updateTrip(tripId, { ...req.body, file }, userId);
        res.json(updatedTrip);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteTrip = async (req, res) => {
    try {
        const tripId = req.params.id;
        const userId = req.userId;
        const trip = await TripModel.getTripById(tripId, userId);
        if (!trip) {
            return res.status(404).send('Trip not found');
        }

        if (trip.file_key) {
            await s3Upload.deleteFileFromS3(trip.file_key);
        }

        await TripModel.deleteTrip(tripId, userId);
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { getTrips, getTripById, createTrip, updateTrip, deleteTrip };
