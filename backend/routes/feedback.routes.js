const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback.model");
const Bill = require("../models/bill.model");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

router.post("/submit", auth, role(["staff", "cashier", "admin", "manager"]), async (req, res) => {
    try {
        const { billId, rating, comment } = req.body;

        // check bill exists
        const bill = await Bill.findById(billId);
        if (!bill) return res.status(404).json({ message: "Bill not found" });

        // prevent multiple feedback on same bill
        const existing = await Feedback.findOne({ billId });
        if (existing) {
            return res.status(400).json({ message: "Feedback already submitted for this bill" });
        }

        const feedback = new Feedback({
            billId,
            orderId: bill.orderId,
            rating,
            comment
        });

        await feedback.save();

        res.json({ message: "Feedback submitted", feedback });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get("/all", auth, role(["admin", "manager"]), async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .populate("billId")
            .populate("orderId")
            .sort({ createdAt: -1 });

        res.json(feedback);

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get("/stats", auth, role(["admin", "manager"]), async (req, res) => {
    try {
        const stats = await Feedback.aggregate([
            {
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(stats);

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


module.exports = router;