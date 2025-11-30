const express = require("express");
const router = express.Router();
const Inventory = require("../models/inventory.model");
const auth = require("../middleware/auth.middleware");

// Add Inventory Item
router.post("/add", auth, async (req, res) => {
    try {
        const { itemName, quantity, unit, lowStockLevel } = req.body;

        const item = new Inventory({
            itemName,
            quantity,
            unit,
            lowStockLevel
        });

        await item.save();
        res.json({ message: "Inventory item added" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get All Inventory Items
router.get("/", auth, async (req, res) => {
    try {
        const items = await Inventory.find();
        res.json(items);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update Inventory Stock
router.put("/update/:id", auth, async (req, res) => {
    try {
        req.body.updatedAt = Date.now();

        await Inventory.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Inventory updated" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete Inventory Item
router.delete("/delete/:id", auth, async (req, res) => {
    try {
        await Inventory.findByIdAndDelete(req.params.id);
        res.json({ message: "Inventory item deleted" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
