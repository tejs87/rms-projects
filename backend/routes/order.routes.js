const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");
const auth = require("../middleware/auth.middleware");

// CREATE ORDER
router.post("/create", auth, async (req, res) => {
    try {
        console.log("Order create body:", req.body); // debug log

        const { tableNumber, items } = req.body;

        // Basic validation
        if (!tableNumber) {
            return res.status(400).json({ message: "tableNumber is required" });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "items array is required and cannot be empty" });
        }

        let total = 0;
        items.forEach(i => {
            if (!i.price || !i.quantity) {
                throw new Error("Each item must have price and quantity");
            }
            total += i.price * i.quantity;
        });

        const order = new Order({
            tableNumber,
            items,
            totalAmount: total,
            createdBy: req.user.id
        });

        await order.save();
        
        const Table = require("../models/table.model");

        await Table.findOneAndUpdate(
            { tableNumber },
            { status: "occupied", currentOrderId: order._id }
        );


// AUTO CREATE KOT
const KOT = require("../models/kot.model");

const kot = new KOT({
    orderId: order._id,
    tableNumber: tableNumber,
    items: items.map(i => ({
        name: i.name,
        quantity: i.quantity
    })),
    kotNumber: "KOT-" + Date.now()
});

await kot.save();

res.json({
    message: "Order created successfully",
    orderId: order._id,
    kotId: kot._id
});


    } catch (error) {
        console.error("ORDER CREATE ERROR:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET ALL ORDERS
router.get("/", auth, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("ORDER LIST ERROR:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// UPDATE ORDER STATUS
router.put("/status/:id", auth, async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: "status is required" });
        }

        await Order.findByIdAndUpdate(req.params.id, { status });
        res.json({ message: "Order status updated" });

    } catch (error) {
        console.error("ORDER STATUS ERROR:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



// KOT: Change status to preparing or ready
router.put("/kot/status/:id", auth, async (req, res) => {
    try {
        const { status } = req.body;

        if (!["preparing", "ready"].includes(status)) {
            return res.status(400).json({
                message: "Status must be preparing or ready"
            });
        }

        await Order.findByIdAndUpdate(req.params.id, { status });

        res.json({ message: "KOT status updated" });

    } catch (error) {
        console.error("KOT STATUS ERROR:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// PAYMENT: Complete Order with Payment
router.put("/pay/:id", auth, async (req, res) => {
    try {
        const { paymentMethod } = req.body;

        if (!["cash", "card", "upi"].includes(paymentMethod)) {
            return res.status(400).json({ message: "Invalid payment method" });
        }

        await Order.findByIdAndUpdate(req.params.id, {
            paymentMethod,
            isPaid: true,
            paidAt: Date.now(),
            status: "completed"
        });

        res.json({ message: "Payment successful" });

    } catch (error) {
        console.error("PAYMENT ERROR:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
