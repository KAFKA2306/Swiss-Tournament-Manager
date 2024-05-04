const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost/tournament', {
 useNewUrlParser: true,
 useUnifiedTopology: true,
});

const userRoutes = require('./routes/user');
const tournamentRoutes = require('./routes/tournament');

app.use('/api/users', userRoutes);
app.use('/api/tournament', tournamentRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
