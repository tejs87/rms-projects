const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const auth = require("../middleware/auth.middleware");


// Register a new user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        let existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ 
        name, 
        email, 
        password: hashedPassword, 
        role 
        });



        await user.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;


// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Create JWT Token
        const jwt = require("jsonwebtoken");
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// PROTECTED ROUTE

router.get("/me", auth, (req, res) => {
    res.json({
        message: "You are authorized",
        user: req.user
    });
});
module.exports = router;

