const TripModel = require('../models/tripModel');
const { uploadFileToS3, deleteFileFromS3 } = require('../config/s3Upload');

exports.getTrips = async (req, res) => {
    try {
        const userId = req.userId;
        const trips = await TripModel.getTripsByUserId(userId);
        res.json(trips);
    } catch (error) {
        console.error('Error in getTrips:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const trip = await TripModel.getTripById(id, userId);
        trip ? res.json(trip) : res.status(404).send('Trip not found');
    } catch (error) {
        console.error('Error in getTrip:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createTrip = async (req, res) => {
    try {
        const userId = req.userId;
        let fileKey;
        if (req.file) {
            const uploadResult = await uploadFileToS3(req.file);
            fileKey = uploadResult.fileKey;
        }
        const newTrip = await TripModel.createTrip({ ...req.body, file_key: fileKey }, userId);
        res.status(201).json(newTrip);
    } catch (error) {
        console.error('Error in createTrip:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        let fileKey;
        if (req.file) {
            const uploadResult = await uploadFileToS3(req.file);
            fileKey = uploadResult.fileKey;

            // Optional: Delete the old file from S3
            const oldTrip = await TripModel.getTripById(id, userId);
            if (oldTrip && oldTrip.file_key) {
                await deleteFileFromS3(oldTrip.file_key);
            }
        }

        const updatedTrip = await TripModel.updateTrip(id, { ...req.body, file_key: fileKey }, userId);
        updatedTrip ? res.json(updatedTrip) : res.status(404).send('Trip not found');
    } catch (error) {
        console.error('Error in updateTrip:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const deletedTrip = await TripModel.deleteTrip(id, userId);
        deletedTrip ? res.json(deletedTrip) : res.status(404).send('Trip not found');
    } catch (error) {
        console.error('Error in deleteTrip:', error);
        res.status(500).send('Internal Server Error');
    }
};
