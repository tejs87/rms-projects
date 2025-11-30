const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    billNumber: {
        type: String,
        unique: true
    },
    tableNumber: Number,
    items: [
        {
            name: String,
            quantity: Number,
            price: Number,
            total: Number
        }
    ],
    subtotal: Number,
    tax: Number,
    totalAmount: Number,
    paymentMethod: {
        type: String,
        enum: ["cash", "card", "upi"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Bill", BillSchema);
