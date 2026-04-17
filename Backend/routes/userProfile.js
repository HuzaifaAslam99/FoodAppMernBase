
const express = require("express")
const User = require('../models/user');
const router = express.Router()
const bcrypt = require('bcrypt');

// Changed to .get
router.get("/userProfile", async (req, res) => {
    try {

        const { _id } = req.query; 
        if (!_id) {
            return res.status(400).json("_id is required");
        }

        const user = await User.findOne({ _id });

        if (!user) {
            return res.status(404).json("User not found");
        }

        res.status(200).json({ 
            username: user.username,
            email: user.email,
            phonenumber: user.phonenumber || "",
            address: user.address || "",
            city: user.city || "",
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error", error: err });
    }
});



router.put("/userProfile", async (req, res) => {
    try {
        const { _id, username, oldPassword, newPassword, confirmPass, phonenumber, address, city } = req.body;

        const user = await User.findOne({ _id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // user.email = email?.trim() || user.email;
        user.username = username?.trim() || user.username;
        // user.phonenumber = phonenumber?.trim() || user.phonenumber;
        user.address = address?.trim() || user.address;
        user.city = city?.trim() || user.city;


        if (phonenumber && phonenumber.toString().trim() !== "") {
            const phoneString = phonenumber.toString().trim();

            if (phoneString.length !== 11) {
              return res.status(400).json({ message: "Phone number must be exactly 11 digits" });
            }

            user.phonenumber = phoneString; 
        }

        if (newPassword && newPassword.trim() !== "") {

            if (!oldPassword || oldPassword.trim() === "") {
                return res.status(400).json({ message: "Current password is required" });
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Current password is incorrect" });
            }

            if (newPassword.trim().length<5) {
                return res.status(401).json({ message: "Password must be at least 5 characters long" });
            }

            if (!(newPassword.trim() === confirmPass.trim())) {
                return res.status(401).json({ message: "Confirm Password is invalid" });
            }

            user.password = newPassword; 
        }

        const updatedUser = await user.save();

        res.status(200).json({ 
            message: "Profile updated successfully", 
            user: updatedUser 
        })

    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ message: "Error in saving data", error: err.message });
    }
});



module.exports = router