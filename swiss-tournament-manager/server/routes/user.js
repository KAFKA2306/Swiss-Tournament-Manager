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
