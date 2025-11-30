const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },

    invoiceNumber: { type: String, required: true, unique: true },

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
    serviceCharge: Number,
    grandTotal: Number,

    paymentMethod: {
        type: String,
        enum: ["cash", "card", "upi"],
        required: true
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
