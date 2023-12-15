const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { authenticateToken } = require('../../middleware/auth');

router.get('/search', authenticateToken, handleSearch);

module.exports = router;

