const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, // Example: Pizza, Drinks, Starter
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Menu", MenuSchema);
