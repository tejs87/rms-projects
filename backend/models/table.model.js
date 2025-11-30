const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true,
        unique: true
    },
    seats: {
        type: Number,
        default: 4
    },
    status: {
        type: String,
        enum: ["available", "occupied", "reserved", "cleaning"],
        default: "available"
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null   // waiter/staff assigned
    },
    currentOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model("Table", TableSchema);
