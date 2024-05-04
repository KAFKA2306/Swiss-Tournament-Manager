
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
