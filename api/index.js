const express = require('express');
const serverless = require('serverless-http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const router = express.Router();
const secretKey = process.env.SECRET_KEY || 'defaultsecret';

// Connect to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err) => {
  if (err) {
    console.error('Postgres connection error:', err.stack);
  } else {
    console.log('Postgres connected');
  }
});

// Middleware
app.use(express.json());
app.use(cors());

// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    const values = [req.body.username, hashedPassword];
    await pool.query(query, values);
    res.status(201).send('User registered');
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Error registering user');
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [req.body.username];
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (validPassword) {
        const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(400).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(400).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Save job data
router.post('/api/save', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM jobs');  // Consider changing this to an update if needed
    for (const job of req.body) {
      const query = 'INSERT INTO jobs (jobId, material, thickness, weldingType, settings) VALUES ($1, $2, $3, $4, $5)';
      const values = [job.jobId, job.material, job.thickness, job.weldingType, job.settings];
      await pool.query(query, values);
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
