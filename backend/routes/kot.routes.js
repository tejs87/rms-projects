const express = require("express");
const router = express.Router();
const KOT = require("../models/kot.model");
const Order = require("../models/order.model");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

router.get("/", auth, role(["kitchen", "admin", "manager"]), async (req, res) => {
    try {
        const kots = await KOT.find().populate("orderId").sort({ createdAt: -1 });
        res.json(kots);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.put("/prepare/:id", auth, role(["kitchen"]), async (req, res) => {
    try {
        const kot = await KOT.findByIdAndUpdate(
            req.params.id,
            { status: "preparing" },
            { new: true }
        );
        res.json(kot);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.put("/complete/:id", auth, role(["kitchen"]), async (req, res) => {
    try {
        const kot = await KOT.findByIdAndUpdate(
            req.params.id,
            { status: "completed" },
            { new: true }
        );
        res.json(kot);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get("/print/:id", auth, role(["admin", "manager", "kitchen"]), async (req, res) => {
    try {
        const kot = await KOT.findById(req.params.id).populate("orderId");
        if (!kot) return res.status(404).json({ message: "KOT not found" });

        res.json(kot); // ready for PDF later
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
module.exports = router;
