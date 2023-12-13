const TripModel = require('../models/tripModel.js');
const { uploadFileToS3 } = require('../config/s3Upload'); // AWS S3 upload utility

const getTrips = async (req, res) => {
    try {
        // Use req.userId instead of req.userId
        const userId = req.userId;
        const trips = await TripModel.getAllTrips(userId);
        res.json(trips);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getTripById = async (req, res) => {
    try {
        const trip = await TripModel.getTripById(req.params.id);
        if (trip) {
            res.json(trip);
        } else {
            res.status(404).send('Trip not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createTrip = async (req, res) => {
    try {
        let mediaUrl = '';
        if (req.file) {
            const uploadResult = await uploadFileToS3(req.file);
            mediaUrl = uploadResult.url; // Ensure this matches the property returned by uploadFileToS3
        }

        const tripData = {
            user_id: req.userId, // User ID from authentication
            ...req.body,
            media_url: mediaUrl
        };

        const newTrip = await TripModel.addTrip(tripData);
        res.status(201).json(newTrip);
    } catch (error) {
        res.status(500).send('Error creating trip: ' + error.message);
    }
};

const updateTrip = async (req, res) => {
    try {
        let mediaUrl = req.body.media_url;
        if (req.file) {
            const uploadResult = await uploadFileToS3(req.file);
            mediaUrl = uploadResult.url;
        }

        const tripData = {
            ...req.body,
            media_url: mediaUrl
        };

        const updatedTrip = await TripModel.updateTrip(req.params.id, tripData);
        if (updatedTrip) {
            res.json(updatedTrip);
        } else {
            res.status(404).send('Trip not found');
        }
    } catch (error) {
        res.status(500).send('Error updating trip: ' + error.message);
    }
};

const deleteTrip = async (req, res) => {
    try {
        const deletedTrip = await TripModel.deleteTrip(req.params.id);
        if (deletedTrip) {
            res.json({ message: 'Trip deleted successfully' });
        } else {
            res.status(404).send('Trip not found');
        }
    } catch (error) {
        res.status(500).send('Error deleting trip: ' + error.message);
    }
};

module.exports = {
    getTrips,
    getTripById,
    createTrip,
    updateTrip,
    deleteTrip
};
