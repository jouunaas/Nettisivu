const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },  // Adjust SSL if needed
});

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { username } = req.body;

        try {
            console.log('Login attempt for username:', username);

            // Simulate a successful database query (bypass password check)
            const query = 'SELECT * FROM users WHERE username = $1';
            const values = [username];
            const result = await pool.query(query, values);
            console.log('Query result:', result.rows);

            if (result.rows.length > 0) {
                const user = result.rows[0];
                console.log(`User found: ${user.username}`);

                // Skip password verification and directly generate a JWT
                console.log('Bypassing password verification. Generating JWT...');
                const token = jwt.sign(
                    { userId: user.id },
                    process.env.JWT_SECRET || 'defaultsecret',
                    { expiresIn: '1h' }
                );
                console.log('JWT generated:', token);
                res.status(200).json({ token });
            } else {
                // Optionally, you can create a new user if not found
                console.warn('User not found');
                res.status(401).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
