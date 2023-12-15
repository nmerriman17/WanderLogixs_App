const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { authenticateToken } = require('../middleware/auth'); // Adjust path as needed

router.get('/search', authenticateToken, handleSearch);

module.exports = router;

