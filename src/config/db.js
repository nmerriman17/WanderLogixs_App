const { Pool } = require('pg');
require('dotenv').config();

let poolConfig;

// Configure the pool based on the environment
if (process.env.NODE_ENV === 'production') {
    poolConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Required for Heroku
        }
    };
} else {
    poolConfig = {
        user: process.env.DB_USER, 
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
    };
}

const pool = new Pool(poolConfig);

// Function for full-text search in the database
const searchDatabase = async (term) => {
    try {
        const query = `
            SELECT 'trips' as source, trip_id as id, destination, start_date, end_date
            FROM trips
            WHERE textsearchable_index_col @@ plainto_tsquery('english', $1)
            UNION ALL
            SELECT 'expenses', expense_id, category, date, amount
            FROM expenses
            WHERE textsearchable_index_col @@ plainto_tsquery('english', $1)
            UNION ALL
            SELECT 'itinerary', event_id, event_name, location, start_datetime
            FROM itinerary
            WHERE textsearchable_index_col @@ plainto_tsquery('english', $1)
            UNION ALL
            SELECT 'media', media_id, tripname, tags, notes
            FROM media
            WHERE textsearchable_index_col @@ plainto_tsquery('english', $1);
        `;

        const result = await pool.query(query, [term]);
        return result.rows;
    } catch (err) {
        console.error('Error executing full-text search query:', err);
        throw err;
    }
};

// Function to register a new user
const registerUser = async (name, email, hashedPassword) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email;',
            [name, email, hashedPassword]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Error in registerUser:', err);
        throw err;
    } finally {
        client.release();
    }
};

// Function to get a user by email
const getUserByEmail = async (email) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT * FROM users WHERE email = $1;',
            [email]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Error in getUserByEmail:', err);
        throw err;
    } finally {
        client.release();
    }
};

module.exports = {
    searchDatabase,
    registerUser,
    getUserByEmail
};
