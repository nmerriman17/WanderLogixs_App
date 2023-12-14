const TripModel = require('../models/tripModel.js');
const { uploadFileToS3 } = require('../config/s3Upload');

const getTrips = async (req, res) => {
    try {
        const userId = req.userId;
        const trips = await TripModel.getAllTrips(userId);
        res.json(trips);
    } catch (error) {
        console.error('Error in getTrips:', error);
        res.status(500).send('Error retrieving trips');
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
        console.error('Error in getTripById:', error);
        res.status(500).send('Error retrieving trip');
    }
};

const createTrip = async (req, res) => {
    try {
        let mediaUrl = '';
        if (req.file) {
            const uploadResult = await uploadFileToS3(req.file);
            mediaUrl = uploadResult.url;
        }

        const tripData = { user_id: req.userId, ...req.body, media_url: mediaUrl };
        const newTrip = await TripModel.addTrip(tripData);
        res.status(201).json(newTrip);
    } catch (error) {
        console.error('Error in createTrip:', error);
        res.status(500).send('Error creating trip');
    }
};

const updateTrip = async (req, res) => {
    try {
        let mediaUrl = req.body.media_url;
        if (req.file) {
            const uploadResult = await uploadFileToS3(req.file);
            mediaUrl = uploadResult.url;
        }

        const tripData = { ...req.body, media_url: mediaUrl };
        const updatedTrip = await TripModel.updateTrip(req.params.id, tripData);
        if (updatedTrip) {
            res.json(updatedTrip);
        } else {
            res.status(404).send('Trip not found');
        }
    } catch (error) {
        console.error('Error in updateTrip:', error);
        res.status(500).send('Error updating trip');
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
        console.error('Error in deleteTrip:', error);
        res.status(500).send('Error deleting trip');
    }
};

module.exports = { getTrips, getTripById, createTrip, updateTrip, deleteTrip };
