// server/models/Match.js
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
 players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
 scores: [Number],
 round: Number,
});

module.exports = mongoose.model('Match', matchSchema);
