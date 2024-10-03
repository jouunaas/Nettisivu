// lib/db.js

import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL, // Ensure this is set in your Vercel environment variables
});

export const query = (text, params) => pool.query(text, params);
