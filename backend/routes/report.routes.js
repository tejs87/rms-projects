const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");
const Inventory = require("../models/inventory.model");
const Recipe = require("../models/recipe.model");
const DeductLog = require("../models/deductLog.model");
const auth = require("../middleware/auth.middleware");
// DAILY SALES REPORT
router.get("/sales/daily", auth, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const orders = await Order.find({
            isPaid: true,
            paidAt: { $gte: today }
        });

        let totalSales = 0;
        let paymentBreakup = {
            cash: 0,
            card: 0,
            upi: 0
        };

        orders.forEach(order => {
            totalSales += order.totalAmount;
            paymentBreakup[order.paymentMethod] += order.totalAmount;
        });

        res.json({
            date: today,
            totalSales,
            paymentBreakup,
            totalOrders: orders.length
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
// BEST SELLING ITEMS
router.get("/sales/items", auth, async (req, res) => {
    try {
        const orders = await Order.find({ isPaid: true });

        let itemCount = {};

        orders.forEach(order => {
            order.items.forEach(i => {
                if (!itemCount[i.name]) itemCount[i.name] = 0;
                itemCount[i.name] += i.quantity;
            });
        });

        res.json(itemCount);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
// LOW STOCK ALERT
router.get("/inventory/low", auth, async (req, res) => {
    try {
        const items = await Inventory.find({
            quantity: { $lte: 50 }    // threshold
        });

        res.json(items);

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
module.exports = router;
    