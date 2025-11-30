const express = require("express");
const router = express.Router();
const DeductLog = require("../models/deductLog.model");
const Inventory = require("../models/inventory.model");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware"); // ⭐ Add Role Middleware

// ==========================
// USER CREATES REQUEST
// ==========================
router.post("/request", auth, role(["staff", "kitchen", "manager", "cashier", "inventory", "admin"]), async (req, res) => {
    try {
        const { inventoryItemId, quantity, reason } = req.body;

        const log = new DeductLog({
            inventoryItemId,
            quantity,
            reason,
            requestedBy: req.user.id
        });

        await log.save();

        res.json({ message: "Deduction request submitted to admin/manager" });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ==========================
// APPROVE REQUEST
// ONLY admin, manager, inventory manager
// ==========================
router.put("/approve/:id", auth, role(["admin", "manager", "inventory"]), async (req, res) => {
    try {
        const log = await DeductLog.findById(req.params.id);
        if (!log) return res.status(404).json({ message: "Request not found" });

        if (log.status !== "pending") {
            return res.status(400).json({ message: "Already processed" });
        }

        // Deduct inventory
        await Inventory.findByIdAndUpdate(
            log.inventoryItemId,
            { $inc: { quantity: -log.quantity } }
        );

        log.status = "approved";
        log.approvedBy = req.user.id;
        log.approvedAt = Date.now();
        await log.save();

        res.json({ message: "Deduction approved and inventory updated" });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ==========================
// REJECT REQUEST
// admin, manager, inventory
// ==========================
router.put("/reject/:id", auth, role(["admin", "manager", "inventory"]), async (req, res) => {
    try {
        const log = await DeductLog.findById(req.params.id);
        if (!log) return res.status(404).json({ message: "Request not found" });

        if (log.status !== "pending") {
            return res.status(400).json({ message: "Already processed" });
        }

        log.status = "rejected";
        log.approvedBy = req.user.id;
        log.approvedAt = Date.now();
        await log.save();

        res.json({ message: "Deduction rejected" });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ==========================
// VIEW ALL REQUESTS
// admin, manager, inventory
// ==========================
router.get("/all", auth, role(["admin", "manager", "inventory"]), async (req, res) => {
    try {
        const logs = await DeductLog.find()
            .populate("inventoryItemId")
            .populate("requestedBy")
            .populate("approvedBy")
            .sort({ createdAt: -1 });

        res.json(logs);

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
