const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    tableNumber: { type: Number, required: true },

    items: [
        {
            menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
            name: String,
            quantity: Number,
            price: Number
        }
    ],

    totalAmount: { type: Number, required: true },

    status: {
        type: String,
        enum: ["pending", "preparing", "ready", "completed"],
        default: "pending"
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    createdAt: { type: Date, default: Date.now },

    // ⭐ NEW PAYMENT FIELDS
    paymentMethod: {
        type: String,
        enum: ["cash", "card", "upi"],
        default: null
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date,
        default: null
    }
});


module.exports = mongoose.model("Order", OrderSchema);
