const express = require('express');
const multer = require('multer'); // Add this import
const router = express.Router();
const tripController = require('../controllers/tripController');
const { authenticateToken } = require('../../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() }); // Setup multer for in-memory file storage


router.get('/', authenticateToken, tripController.getTrips);
router.get('/:id', authenticateToken, tripController.getTrip);
router.post('/', [authenticateToken, upload.single('file')], tripController.createTrip); 
router.put('/:id', [authenticateToken, upload.single('file')], tripController.updateTrip); 
router.delete('/:id', authenticateToken, tripController.deleteTrip);

module.exports = router;
