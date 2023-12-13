const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerUser, getUserByEmail } = require('../config/db.js'); 

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' }); // Extended token lifespan
};

const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
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
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).send('User already exists with the provided email');
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = await registerUser(name, email, hashedPassword);
        if (newUser) {
            const token = generateToken(newUser.id);
            res.status(201).json({ user: { name: newUser.name, email: newUser.email, id: newUser.id }, token });
        } else {
            res.status(400).send('User could not be created');
        }
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).send('Server error during registration');
    }
});

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

        const token = generateToken(user.id);
        res.json({ token });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).send('Server error during login');
    }
});

module.exports = router;
