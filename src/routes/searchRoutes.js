const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { authenticateToken } = require('../../middleware/auth');

// Correctly reference handleSearch from searchController
router.get('/search', authenticateToken, searchController.handleSearch);

module.exports = router;
