const ItineraryModel = require('../models/itineraryModel.js');

const getItineraries = async (req, res) => {
    try {
        const userId = req.userId;
        const itineraries = await ItineraryModel.getAllItineraries(userId);
        res.json(itineraries);
    } catch (error) {
        console.error("Error in getItineraries:", error);
        res.status(500).send(error.message);
    }
};

const getItineraryById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const itinerary = await ItineraryModel.getItineraryById(id, userId);
        if (itinerary) {
            res.json(itinerary);
        } else {
            res.status(404).send('Itinerary not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createItinerary = async (req, res) => {
    try {
        const userId = req.userId;
        const newItinerary = await ItineraryModel.addItinerary(req.body, userId);
        res.status(201).json(newItinerary);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateItinerary = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const updatedItinerary = await ItineraryModel.updateItinerary(id, req.body, userId);
        if (!updatedItinerary) {
            return res.status(404).send('Itinerary not found');
        }
        res.json(updatedItinerary);
    } catch (error) {
        res.status(500).send('Error updating itinerary');
    }
};

const deleteItinerary = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const deletedItinerary = await ItineraryModel.deleteItinerary(id, userId);
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
    deleteItinerary
};
