const express = require("express");
const router = express.Router();
const Inventory = require("../models/inventory.model");

// GET ALL ITEMS
router.get("/", async (req, res) => {
  try {
    const items = await Inventory.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD NEW ITEM
router.post("/add", async (req, res) => {
  try {
    console.log("ADD API HIT:", req.body); // Debugger
    const newItem = new Inventory(req.body);
    await newItem.save();

    res.json({ message: "Item added", item: newItem });
  } catch (err) {
    console.error("ADD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// UPDATE ITEM
router.put("/update/:id", async (req, res) => {
  try {
    const updated = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: "Item updated", updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE ITEM
router.delete("/delete/:id", async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);

    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
