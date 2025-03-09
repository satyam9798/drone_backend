import pkg from 'pg';
const { Pool } = pkg;

import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 6432,
});

/**
 * Executes a database query.
 * @param {string} text - The SQL query string.
 * @param {Array} [params] - The parameters for the SQL query.
 * @returns {Promise<Object>} - Query result.
 */
export const query = (text, params) => pool.query(text, params);

export default pool;
