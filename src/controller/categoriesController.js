import { query } from '../datastore/dbClient.js';

/**
 * getCategories
 *
 * get all the categories
 */
export const getCategories = async (req, res) => {
    try {
        const result = await query(`SELECT id, name FROM public.categories`);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
