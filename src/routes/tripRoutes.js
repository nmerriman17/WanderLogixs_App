const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController'); 
const { authenticateToken } = require('../../middleware/auth');
const multer = require('multer');
const upload = multer(); 

// Routes
router.get('/', authenticateToken, tripController.getTrips);
router.get('/:id', authenticateToken, tripController.getTripById);
router.post('/', authenticateToken, upload.single('media'), tripController.createTrip);
router.put('/:id', authenticateToken, upload.single('media'), tripController.updateTrip);
router.delete('/:id', authenticateToken, tripController.deleteTrip);

module.exports = router;
