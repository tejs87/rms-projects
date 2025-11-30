const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// ADMIN: Create staff
router.post("/create", auth, role(["admin"]), async (req, res) => {
    try {
        const { name, email, password, role: userRole } = req.body;

        let exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "Email already exists" });

        const hash = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hash,
            role: userRole
        });

        await user.save();

        res.json({ message: "Staff created", user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ADMIN: View all staff
router.get("/all", auth, role(["admin", "manager"]), async (req, res) => {
    try {
        const staff = await User.find().sort({ createdAt: -1 });
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ADMIN: Update staff
router.put("/update/:id", auth, role(["admin"]), async (req, res) => {
    try {
        const { name, role: newRole } = req.body;

        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { name, role: newRole },
            { new: true }
        );

        res.json({ message: "Updated", updated });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ADMIN: Change Password
router.put("/reset-password/:id", auth, role(["admin"]), async (req, res) => {
    try {
        const { password } = req.body;

        const hash = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(req.params.id, { password: hash });

        res.json({ message: "Password updated" });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ADMIN: Block/Unblock User
router.put("/status/:id", auth, role(["admin"]), async (req, res) => {
    try {
        const { isActive } = req.body;

        await User.findByIdAndUpdate(req.params.id, { isActive });

        res.json({ message: "Status updated" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ADMIN: Delete Staff
router.delete("/delete/:id", auth, role(["admin"]), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Staff deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
