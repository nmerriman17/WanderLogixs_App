const TripModel = require('../models/tripModel');
const s3Upload = require('../config/s3Upload'); 

const getTrips = async (req, res) => {
    try {
        const userId = req.userId;
        const trips = await TripModel.getTripsByUserId(userId);
        res.json(trips);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getTripById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const trip = await TripModel.getTripById(id, userId);
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
        let fileKey = null;

        if (req.file) {
            const uploadResult = await s3Upload.uploadFileToS3(req.file);
            fileKey = uploadResult.fileKey;
        }

        const tripData = { ...req.body, user_id: userId, file_key: fileKey };
        const newTrip = await TripModel.createTrip(tripData);
        res.status(201).json(newTrip);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const existingTrip = await TripModel.getTripById(id, userId);

        if (!existingTrip) {
            return res.status(404).send('Trip not found');
        }

        let fileKey = existingTrip.file_key;

        if (req.file) {
            if (fileKey) {
                await s3Upload.deleteFileFromS3(fileKey);
            }
            const uploadResult = await s3Upload.uploadFileToS3(req.file);
            fileKey = uploadResult.fileKey;
        }

        const updatedTripData = { ...req.body, file_key: fileKey };
        const updatedTrip = await TripModel.updateTrip(id, updatedTripData);
        res.json(updatedTrip);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const trip = await TripModel.getTripById(id, userId);

        if (!trip) {
            return res.status(404).send('Trip not found');
        }

        if (trip.file_key) {
            await s3Upload.deleteFileFromS3(trip.file_key);
        }

        await TripModel.deleteTrip(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    getTrips,
    getTripById,
    createTrip,
    updateTrip,
    deleteTrip
};
