const ItineraryModel = require('../models/itineraryModel');

const getItineraries = async (req, res) => {
    try {
        const itineraries = await ItineraryModel.getAllItineraries(req.userId);
        res.json(itineraries);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getItineraryById = async (req, res) => {
    try {
        const itinerary = await ItineraryModel.getItineraryById(req.params.id, req.userId);
        if (!itinerary) {
            return res.status(404).send('Itinerary not found');
        }
        res.json(itinerary);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createItinerary = async (req, res) => {
    try {
        const newItinerary = await ItineraryModel.addItinerary(req.body, req.userId);
        res.status(201).json(newItinerary);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateItinerary = async (req, res) => {
    try {
        const updatedItinerary = await ItineraryModel.updateItinerary(req.params.id, req.body, req.userId);
        if (!updatedItinerary) {
            return res.status(404).send('Itinerary not found');
        }
        res.json(updatedItinerary);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteItinerary = async (req, res) => {
    try {
        const deletedItinerary = await ItineraryModel.deleteItinerary(req.params.id, req.userId);
        if (!deletedItinerary) {
            return res.status(404).send('Itinerary not found');
        }
        res.json(deletedItinerary);
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
