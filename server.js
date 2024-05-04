// server/index.js
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

// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
 name: String,
 email: String,
 password: String,
});

module.exports = mongoose.model('User', userSchema);

// server/models/Match.js
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
 players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
 scores: [Number],
 round: Number,
});

module.exports = mongoose.model('Match', matchSchema);

// server/routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
 const { name, email, password } = req.body;
 const user = new User({ name, email, password });
 await user.save();
 res.send(user);
});

module.exports = router;

// server/routes/tournament.js
const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const User = require('../models/User');

router.post('/preliminary', async (req, res) => {
 const users = await User.find();
 const matches = [];

 for (let round = 1; round <= 4; round++) {
   const shuffledUsers = users.sort(() => 0.5 - Math.random());
   for (let i = 0; i < shuffledUsers.length; i += 4) {
     const match = new Match({
       players: shuffledUsers.slice(i, i + 4),
       round,
     });
     matches.push(match);
   }
 }

 await Match.insertMany(matches);
 res.send(matches);
});

router.post('/preliminary/:matchId/report', async (req, res) => {
 const { matchId } = req.params;
 const { scores } = req.body;
 const match = await Match.findByIdAndUpdate(matchId, { scores });
 res.send(match);
});

router.get('/preliminary/results', async (req, res) => {
 const matches = await Match.find().populate('players');
 const userScores = {};

 matches.forEach((match) => {
   match.players.forEach((player, index) => {
     if (!userScores[player._id]) {
       userScores[player._id] = {
         name: player.name,
         scores: [],
       };
     }
     userScores[player._id].scores.push(match.scores[index]);
   });
 });

 const results = Object.values(userScores).map((user) => ({
   ...user,
   totalScore: user.scores.reduce((sum, score) => sum + score, 0),
 }));

 results.sort((a, b) => b.totalScore - a.totalScore);
 res.send(results.slice(0, 22));
});

module.exports = router;

// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './Register';
import Dashboard from './Dashboard';

function App() {
 return (
   <Router>
     <Switch>
       <Route path="/register" component={Register} />
       <Route path="/" component={Dashboard} />
     </Switch>
   </Router>
 );
}

export default App;

// client/src/Register.js
import React, { useState } from 'react';
import axios from 'axios';

function Register() {
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

 const handleSubmit = async (e) => {
   e.preventDefault();
   await axios.post('/api/users/register', { name, email, password });
   window.location = '/';
 };

 return (
   <form onSubmit={handleSubmit}>
     <input
       type="text"
       placeholder="Name"
       value={name}
       onChange={(e) => setName(e.target.value)}
     />
     <input
       type="email"
       placeholder="Email"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
     />
     <input
       type="password"
       placeholder="Password"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
     />
     <button type="submit">Register</button>
   </form>
 );
}

export default Register;

// client/src/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
 const [matches, setMatches] = useState([]);
 const [results, setResults] = useState([]);

 useEffect(() => {
   const fetchData = async () => {
     const { data } = await axios.post('/api/tournament/preliminary');
     setMatches(data);
   };
   fetchData();
 }, []);

 const handleReport = async (matchId, scores) => {
   await axios.post(`/api/tournament/preliminary/${matchId}/report`, { scores });
   const { data } = await axios.get('/api/tournament/preliminary/results');
   setResults(data);
 };

 return (
   <div>
     <h2>Matches</h2>
     {matches.map((match) => (
       <div key={match._id}>
         <p>
           {match.players.map((player) => player.name).join(' vs ')}
         </p>
         <input
           type="text"
           placeholder="Scores"
           onBlur={(e) => handleReport(match._id, e.target.value.split(','))}
         />
       </div>
     ))}
     <h2>Results</h2>
     {results.map((result, index) => (
       <p key={result.name}>
         {index + 1}. {result.name} - {result.totalScore}
       </p>
     ))}
   </div>
 );
}

export default Dashboard;
