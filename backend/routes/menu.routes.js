const express = require("express");
const router = express.Router();
const Menu = require("../models/menu.model");
const auth = require("../middleware/auth.middleware");

// Add Menu Item
router.post("/add", auth, async (req, res) => {
    try {
        const { name, category, price } = req.body;

        const item = new Menu({ name, category, price });
        await item.save();

        res.json({ message: "Menu item added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get All Menu Items
router.get("/", auth, async (req, res) => {
    try {
        const items = await Menu.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update Menu Item
router.put("/update/:id", auth, async (req, res) => {
    try {
        await Menu.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Menu item updated" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete Menu Item
router.delete("/delete/:id", auth, async (req, res) => {
    try {
        await Menu.findByIdAndDelete(req.params.id);
        res.json({ message: "Menu item deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
