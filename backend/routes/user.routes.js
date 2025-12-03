// backend/routes/user.routes.js
const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// GET all users (admin only)
router.get("/", auth, role(["admin"]), async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE user (admin)
router.delete("/:id", auth, role(["admin"]), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// UPDATE user (admin)
router.put("/:id", auth, role(["admin"]), async (req, res) => {
  try {
    const update = req.body; // e.g. { role: 'staff' }
    await User.findByIdAndUpdate(req.params.id, update);
    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
