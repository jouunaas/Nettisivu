// lib/db.js

import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL, // Use your connection string from the .env file
});

export const query = (text, params) => pool.query(text, params);
