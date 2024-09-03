const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

app.use(express.json());

app.post('/login', async (req, res) => {
    // Your login logic here
});

module.exports = app;
