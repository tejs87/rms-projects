const mongoose = require("mongoose");

const KotSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    kotNumber: String,
    tableNumber: Number,
    items: [
        { name: String, quantity: Number }
    ],
    status: { type: String, enum: ["pending", "preparing", "completed"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("KOT", KotSchema);
