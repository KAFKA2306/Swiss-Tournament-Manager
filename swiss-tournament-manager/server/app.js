const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/user');
const tournamentRoutes = require('./routes/tournament');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/tournament', tournamentRoutes);

module.exports = app;
