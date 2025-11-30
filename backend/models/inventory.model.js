const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }, // grams, kg, liters, pieces
    lowStockLevel: { type: Number, default: 10 },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Inventory", InventorySchema);
