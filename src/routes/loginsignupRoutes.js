const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerUser, getUserByEmail } = require('../config/db.js'); 

const router = express.Router();

// Utility function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Function to validate email format (basic example)
const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Route for user registration
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Basic input validation
    if (!name || !email || !password) {
        return res.status(400).send('Please fill in all fields.');
    }
    if (!isValidEmail(email)) {
        return res.status(400).send('Invalid email format.');
    }
    if (password.length < 6) {
        return res.status(400).send('Password must be at least 6 characters long.');
    }

    try {
        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).send('User already exists with the provided email');
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10); 

        const newUser = await registerUser(name, email, hashedPassword);
        if (newUser) {
            // Generate token for the new user
            const token = generateToken(newUser.id);
            res.status(201).json({ user: { name: newUser.name, email: newUser.email, id: newUser.id }, token });
        } else {
            res.status(400).send('User could not be created');
        }
    } catch (err) {
        res.status(500).send('Server error during registration: ' + err.message);
    }
});

// Route for user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Please fill in all fields.');
    }

    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).send('Invalid Credentials');
        }

        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send('Invalid Credentials');
        }

        // Generate JWT token
        const token = generateToken(user.id);
        res.json({ token });
    } catch (err) {
        res.status(500).send('Server error during login: ' + err.message);
    }
});

module.exports = router;
