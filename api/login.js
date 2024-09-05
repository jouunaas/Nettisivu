const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User'); // Make sure this path is correct

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        if (req.url === '/admin/add-user') {
            // Route for adding a new user
            const { username, password } = req.body;

            try {
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = new User({ username, password: hashedPassword });

                // Save the new user
                await newUser.save();

                res.status(200).json({ message: 'User created successfully' });
            } catch (error) {
                res.status(500).json({ message: 'Error creating user', error });
            }
        } else if (req.url === '/login') {
            // Route for logging in a user
            const { username, password } = req.body;

            try {
                // Find the user in the database
                const user = await User.findOne({ username });

                if (!user) {
                    return res.status(401).json({ message: 'Incorrect login details' });
                }

                // Compare the password
                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return res.status(401).json({ message: 'Incorrect login details' });
                }

                // Create a JWT token
                const token = jwt.sign(
                    { userId: user._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                // Respond with the token
                res.status(200).json({ token });
            } catch (error) {
                res.status(500).json({ message: 'Server error', error });
            }
        } else {
            // Route not found
            res.status(404).json({ message: 'Route not found' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
