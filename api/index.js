const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const app = express();
const router = express.Router();
const secretKey = process.env.SECRET_KEY || 'defaultsecret';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
}));

const Job = mongoose.model('Job', new mongoose.Schema({
  jobId: String,
  material: String,
  thickness: String,
  weldingType: String,
  settings: String,
}));

const jobSchema = Joi.array().items(
  Joi.object({
    jobId: Joi.string().required(),
    material: Joi.string().required(),
    thickness: Joi.string().required(),
    weldingType: Joi.string().required(),
    settings: Joi.string().required(),
  }).required()
).required();

// Middleware
app.use(express.json());

// Routes
router.post('/api/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ username: req.body.username, password: hashedPassword });
    await user.save();
    res.send('User registered');
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Error registering user');
  }
});

router.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ username: user.username }, secretKey);
      res.json({ token });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/api/save', authenticateToken, async (req, res) => {
  const { error } = jobSchema.validate(req.body);
  if (error) return res.status(400).send(`Validation error: ${error.details[0].message}`);

  try {
    await Job.deleteMany();
    for (const job of req.body) {
      const newJob = new Job(job);
      await newJob.save();
    }
    res.send('Data saved successfully');
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).send('Error saving data');
  }
});

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Apply routes to the app
app.use('/', router);

// Export handler for serverless deployment
module.exports.handler = serverless(app);
