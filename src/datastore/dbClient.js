import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

let pool;

const createPool = () => {
    pool = new Pool({
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT || 5432,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
        ssl: { rejectUnauthorized: false },
    });

    // Global pool error handler
    pool.on('error', (err) => {
        console.error('Unexpected PostgreSQL error:', err.message);
        console.log('Attempting to reconnect in 5 seconds...');
        setTimeout(() => {
            pool.end();
            createPool();
        }, 5000);
    });

    return pool;
};

createPool();

/**
 * Executes a database query.
 */
export const query = (text, params) => pool.query(text, params);

/**
 * Test DB connection on startup
 */
export const testDbConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('PostgreSQL connected successfully');
        client.release();
    } catch (err) {
        console.error('Failed to connect to PostgreSQL on startup:', err.message);
        console.log('Retrying in 5 seconds...');
        setTimeout(testDbConnection, 5000);
    }
};

export default pool;
