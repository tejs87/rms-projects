const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
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

    /* ---------------------------------------------------------
       ⭐ Payment & Billing Fields (NEW)
    ----------------------------------------------------------*/

    // Payment method: cash/card/upi
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi"],
      default: null
    },

    // Payment status
    isPaid: {
      type: Boolean,
      default: false
    },

    paidAt: {
      type: Date,
      default: null
    },

    // ⭐ Customer Info
    customerName: { type: String, default: "" },
    customerPhone: { type: String, default: "" },

    // ⭐ Taxes & Charges
    discount: { type: Number, default: 0 }, // % or absolute (frontend decides)
    tax: { type: Number, default: 0 }, // GST amount
    serviceCharge: { type: Number, default: 0 },

    // ⭐ Grand Total after calculations
    grandTotal: { type: Number, default: 0 },

    // ⭐ Invoice Number (auto-generated)
    invoiceNumber: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
