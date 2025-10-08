import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;
const pgConfig = {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    connectionTimeoutMillis: 10000, // ⏱ wait 10s max for initial connection
    idleTimeoutMillis: 30000, // close idle clients after 30s
    max: 10, // max pool size
};

export const client = new Pool(pgConfig);

/**
 * Connects to Postgres with retries
 */
export async function connectToPostgres(retries = 5, delayMs = 5000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await client.connect();
            console.log('✅ Connected to PostgreSQL');
            return;
        } catch (err) {
            console.error(
                `❌ Failed to connect to Postgres (attempt ${attempt}/${retries}):`,
                err.message,
            );

            if (attempt < retries) {
                console.log(`⏳ Retrying in ${delayMs / 1000}s...`);
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            } else {
                console.error('🚨 Could not connect to Postgres. Exiting.');
                process.exit(1); // stop the server if DB is unavailable
            }
        }
    }
}

/**
 * Executes a database query.
 */
export const query = (text, params) => client.query(text, params);
