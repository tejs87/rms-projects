const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");
const Invoice = require("../models/invoice.model");
const Inventory = require("../models/inventory.model");
const User = require("../models/user.model");
const KOT = require("../models/kot.model");
const Menu = require("../models/menu.model");
const Table = require("../models/table.model");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// DASHBOARD SUMMARY
router.get("/", auth, role(["admin", "manager"]), async (req, res) => {
    try {
        // Today date range
        const start = new Date();
        start.setHours(0,0,0,0);

        const end = new Date();
        end.setHours(23,59,59,999);

        // Today invoices
        const todayInvoices = await Invoice.find({
            createdAt: { $gte: start, $lte: end }
        });

        const todayOrders = todayInvoices.length;
        const todaySales = todayInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);

        let paymentStats = { cash: 0, card: 0, upi: 0 };
        todayInvoices.forEach(inv => paymentStats[inv.paymentMethod] += inv.grandTotal);

        // Pending KOT
        const pendingKOT = await KOT.countDocuments({ status: "pending" });

        // Low stock alert
        const lowStockItems = await Inventory.find({ quantity: { $lte: 5 } });

        // Staff count
        const staffCount = await User.countDocuments();

        // Menu count
        const menuCount = await Menu.countDocuments();

        // Occupied tables
        const activeTables = await Table.countDocuments({ status: "occupied" });

        res.json({
            todaySales,
            todayOrders,
            paymentStats,
            pendingKOT,
            lowStock: lowStockItems.length,
            staffCount,
            menuCount,
            activeTables
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// REVENUE GRAPH — LAST 7 DAYS
router.get("/week-graph", auth, role(["admin", "manager"]), async (req, res) => {
    try {
        let result = [];

        for (let i = 6; i >= 0; i--) {
            const dayStart = new Date();
            dayStart.setDate(dayStart.getDate() - i);
            dayStart.setHours(0,0,0,0);

            const dayEnd = new Date();
            dayEnd.setDate(dayEnd.getDate() - i);
            dayEnd.setHours(23,59,59,999);

            const invoices = await Invoice.find({
                createdAt: { $gte: dayStart, $lte: dayEnd }
            });

            const total = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);

            result.push({
                date: dayStart.toDateString(),
                total
            });
        }

        res.json(result);

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
