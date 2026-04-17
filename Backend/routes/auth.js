const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();

router.post('/register', async (req, res) => {
 try {
    const {username, email, password } = req.body;
    console.log("Data received from form:", req.body);

    const exists = await User.findOne({ email });
       if (exists) return res.status(400).json({ message: 'User already exists' });
       const user = new User({username, email, password});
       await user.save();
       res.status(201).json({ message: 'User registered' });
       console.log(user)
    } 
    catch (err) {
       console.error(err);
       res.status(500).json({ message: 'Error registering user' });
    }
});
// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password }= req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid password' });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: token, _id: user._id });
    }
    catch (err) {
        console.error("LOGIN CRASH DETAILS:", err);
        res.status(500).json({ message: 'Error logging in' });
    }
});



module.exports = router;