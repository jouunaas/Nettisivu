require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');

const app = express();
app.use(express.json());
app.use(express.static('public'));  // Serve static files

const secretKey = process.env.SECRET_KEY || 'defaultsecret';

mongoose.connect('mongodb://localhost:27017/mydatabase')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a User model
const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String,
}));

// Define a Job model
const Job = mongoose.model('Job', new mongoose.Schema({
    jobId: String,
    material: String,
    thickness: String,
    weldingType: String,
    settings: String,
}));

// Register endpoint
app.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ username: req.body.username, password: hashedPassword });
    await user.save();
    res.send('User registered');
});

// Login endpoint
app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({ username: user.username }, secretKey);
        res.json({ token });
    } else {
        res.status(400).send('Invalid credentials');
    }
});

// Save data endpoint (authenticated)
app.post('/save', authenticateToken, async (req, res) => {
    // Validate and save data
});

// Middleware to check JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get the token part from 'Bearer <token>'
    if (token == null) return res.sendStatus(401);
    
    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Fetch WPQR data
app.get('/api/wpqr', authenticateToken, async (req, res) => {
    try {
        const wpqrData = await WPQR.find();  // Assuming WPQR is a defined model
        res.json(wpqrData);
    } catch (err) {
        console.error('Error fetching WPQR data:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Fetch WPS data
app.get('/api/wps', authenticateToken, async (req, res) => {
    try {
        const wpsData = await WPS.find();  // Assuming WPS is a defined model
        res.json(wpsData);
    } catch (err) {
        console.error('Error fetching WPS data:', err);
        res.status(500).send('Internal Server Error');
    }
});


// Define a refined schema for job validation
const jobSchema = Joi.array().items(
    Joi.object({
        jobId: Joi.string().required(),
        material: Joi.string().required(),
        thickness: Joi.string().required(),
        weldingType: Joi.string().required(),
        settings: Joi.string().required(),
    }).required()
).required();

app.post('/save', authenticateToken, async (req, res) => {
    const { error } = jobSchema.validate(req.body);
    if (error) return res.status(400).send(`Validation error: ${error.details[0].message}`);

    try {
        const jobs = req.body;

        // Clear existing jobs
        await Job.deleteMany();

        // Save new jobs
        for (const job of jobs) {
            const newJob = new Job(job); // Use the job object directly
            await newJob.save();
        }
        res.send('Data saved successfully');
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});