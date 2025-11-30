const express = require("express");
const router = express.Router();
const Bill = require("../models/bill.model");
const Order = require("../models/order.model");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

router.post("/generate/:orderId", auth, role(["admin", "manager", "cashier"]), async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Ensure order is paid
        if (!order.isPaid) {
            return res.status(400).json({ message: "Order is not paid" });
        }

        // Prepare bill data
        const items = order.items.map(i => ({
            name: i.name,
            quantity: i.quantity,
            price: i.price,
            total: i.quantity * i.price
        }));

        const subtotal = items.reduce((sum, i) => sum + i.total, 0);
        const tax = subtotal * 0.05; // 5% GST
        const totalAmount = subtotal + tax;

        const billNumber = "BILL-" + Date.now();

        const bill = new Bill({
            orderId: order._id,
            tableNumber: order.tableNumber,
            items,
            subtotal,
            tax,
            totalAmount,
            paymentMethod: order.paymentMethod,
            billNumber
        });

        await bill.save();

        res.json({ message: "Bill generated", bill });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get("/:billId", auth, async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.billId).populate("orderId");
        if (!bill) return res.status(404).json({ message: "Bill not found" });

        res.json(bill);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
module.exports = router;
