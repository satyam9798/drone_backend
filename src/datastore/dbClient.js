import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'pass',
    port: 5432,
});

/**
 * Executes a database query.
 * @param {string} text - The SQL query string.
 * @param {Array} [params] - The parameters for the SQL query.
 * @returns {Promise<Object>} - Query result.
 */
export const query = (text, params) => pool.query(text, params);
