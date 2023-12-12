const ItineraryModel = require('../models/itineraryModel.js'); 

// Validation function for itinerary data
const validateItineraryData = (data) => {
    let errors = {};

    // Check for required fields
    if (!data.eventName) errors.eventName = 'Event name is required';
    if (!data.location) errors.location = 'Location is required';
    if (!data.startDate) errors.startDate = 'Start date is required';
    if (!data.startTime) errors.startTime = 'Start time is required';
    if (!data.endDate) errors.endDate = 'End date is required';
    if (!data.endTime) errors.endTime = 'End time is required';

    // Check logical date and time range
    const startDateTime = new Date(data.startDate + 'T' + data.startTime);
    const endDateTime = new Date(data.endDate + 'T' + data.endTime);
    if (startDateTime > endDateTime) {
        errors.dateRange = 'Start date and time must be before end date and time';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Get all itineraries for a specific user
const getItineraries = async (req, res) => {
    try {
        const userId = req.userId; // Assumes userId is set by your authentication middleware
        const itineraries = await ItineraryModel.getAllItineraries(userId);
        res.json(itineraries);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Get a single itinerary by ID
const getItineraryById = async (req, res) => {
    try {
        const itineraryId = req.params.id;
        const userId = req.userId;
        const itinerary = await ItineraryModel.getItineraryById(itineraryId, userId);
        if (itinerary) {
            res.json(itinerary);
        } else {
            res.status(404).send('Itinerary not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Create a new itinerary
const createItinerary = async (req, res) => {
    const { isValid, errors } = validateItineraryData(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    try {
        const userId = req.userId;
        const newItinerary = await ItineraryModel.addItinerary({ ...req.body, userId });
        res.status(201).json(newItinerary);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Update an itinerary
const updateItinerary = async (req, res) => {
    try {
        const itineraryId = req.params.id;
        const userId = req.userId;
        const updatedItinerary = await ItineraryModel.updateItinerary(itineraryId, req.body, userId);
        if (!updatedItinerary) {
            return res.status(404).send('Itinerary not found');
        }
        res.json(updatedItinerary);
    } catch (error) {
        res.status(500).send('Error updating itinerary');
    }
};



// Delete an itinerary
const deleteItinerary = async (req, res) => {
    try {
        const itineraryId = req.params.id;
        const userId = req.userId;
        const deletedItinerary = await ItineraryModel.deleteItinerary(itineraryId, userId);
        if (deletedItinerary) {
            res.json(deletedItinerary);
        } else {
            res.status(404).send('Itinerary not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    getItineraries,
    getItineraryById,
    createItinerary,
    updateItinerary,
    deleteItinerary,
};
