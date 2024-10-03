const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        try {
            const query = 'SELECT * FROM users WHERE username = $1';
            const values = [username];
            const result = await pool.query(query, values);

            if (result.rows.length > 0) {
                const user = result.rows[0];
                const isMatch = await bcrypt.compare(password, user.password);

                if (isMatch) {
                    const token = jwt.sign(
                        { userId: user.id },
                        process.env.JWT_SECRET || 'defaultsecret',
                        { expiresIn: '1h' }
                    );
                    res.status(200).json({ token });
                } else {
                    res.status(401).json({ message: 'Incorrect login details' });
                }
            } else {
                res.status(401).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
