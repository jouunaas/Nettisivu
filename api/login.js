const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

module.exports = async (req, res) => {
    // Ensure the request method is POST
    if (req.method === 'POST') {
        // Parsing JSON request body if needed
        const { username, password } = req.body || {}; // Avoid undefined body

        // Validate the presence of username and password
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Initialize PostgreSQL pool connection
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }, // Only use this if you are sure SSL is needed
        });

        try {
            // Query the user by username
            const query = 'SELECT * FROM users WHERE username = $1';
            const values = [username];
            const result = await pool.query(query, values);

            // Check if user exists
            if (result.rows.length > 0) {
                const user = result.rows[0];

                // Check if password matches
                const isMatch = await bcrypt.compare(password, user.password);

                if (isMatch) {
                    // Generate JWT token
                    const token = jwt.sign(
                        { userId: user.id },
                        process.env.JWT_SECRET || 'defaultsecret',
                        { expiresIn: '1h' }
                    );

                    // Return token to client
                    res.status(200).json({ token });
                } else {
                    // Password does not match
                    res.status(401).json({ message: 'Incorrect login details' });
                }
            } else {
                // No user found with the provided username
                res.status(401).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Error during login:', error);

            // Server error
            res.status(500).json({
                message: 'Server error',
                error: error.message,
            });
        } finally {
            // Close pool connection to avoid connection issues in serverless environment
            await pool.end();
        }
    } else {
        // Handle non-POST requests
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
