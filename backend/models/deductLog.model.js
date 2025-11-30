const mongoose = require("mongoose");

const DeductLogSchema = new mongoose.Schema({
    inventoryItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory",
        required: true
    },
    quantity: { type: Number, required: true },
    reason: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    createdAt: { type: Date, default: Date.now },
    approvedAt: { type: Date, default: null }
});

module.exports = mongoose.model("DeductLog", DeductLogSchema);
