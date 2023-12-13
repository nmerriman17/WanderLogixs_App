const bcryptjs = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Heroku
    }
};

const pool = new Pool(poolConfig);

const createUser = async () => {
    const hashedPassword = await bcryptjs.hash('testPassword123', 10); // New password
    try {
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            ['Test User', 'test@example.com', hashedPassword]
        );
        console.log('Test User Created:', result.rows[0]);
    } catch (err) {
        console.error('Error creating test user', err);
    } finally {
        await pool.end();
    }
};

createUser();
