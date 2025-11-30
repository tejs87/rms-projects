const express = require("express");
const router = express.Router();
const Table = require("../models/table.model");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
router.post("/add", auth, role(["admin", "manager"]), async (req, res) => {
    try {
        const { tableNumber, capacity } = req.body;

        const existing = await Table.findOne({ tableNumber });
        if (existing) {
            return res.status(400).json({ message: "Table already exists" });
        }

        const table = new Table({ tableNumber, capacity });
        await table.save();

        res.json({ message: "Table created successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get("/", auth, role(["admin", "manager", "staff"]), async (req, res) => {
    try {
        const tables = await Table.find().populate("assignedTo");
        res.json(tables);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.put("/assign/:id", auth, role(["admin", "manager"]), async (req, res) => {
    try {
        const { assignedTo } = req.body;

        const table = await Table.findByIdAndUpdate(
            req.params.id,
            { assignedTo },
            { new: true }
        );

        res.json({ message: "Table assigned", table });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
router.put("/status/:id", auth, role(["admin", "manager", "staff"]), async (req, res) => {
    try {
        const { status } = req.body;

        const table = await Table.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json({ message: "Status updated", table });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.put("/open/:id", auth, role(["admin", "manager", "staff"]), async (req, res) => {
    try {
        const { orderId } = req.body;

        const table = await Table.findByIdAndUpdate(
            req.params.id,
            { status: "occupied", currentOrderId: orderId },
            { new: true }
        );

        res.json({ message: "Table opened", table });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.put("/close/:id", auth, role(["admin", "manager", "staff"]), async (req, res) => {
    try {
        const table = await Table.findByIdAndUpdate(
            req.params.id,
            { status: "cleaning", currentOrderId: null },
            { new: true }
        );

        res.json({ message: "Table closed and marked for cleaning", table });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
module.exports = router;