const express = require("express");
const router = express.Router();
const Invoice = require("../models/invoice.model");
const Order = require("../models/order.model");
const auth = require("../middleware/auth.middleware");
const generatePDF = require("../utils/invoicePDF");
const path = require("path");

// Generate Invoice After Payment
router.post("/generate/:orderId", auth, async (req, res) => {
    try {
        const { tax = 0, serviceCharge = 0 } = req.body;

        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        const items = order.items.map(i => ({
            name: i.name,
            quantity: i.quantity,
            price: i.price,
            total: i.price * i.quantity
        }));

        const subtotal = order.totalAmount;
        const grandTotal = subtotal + tax + serviceCharge;

        const invoice = new Invoice({
            orderId: order._id,
            invoiceNumber: "INV-" + Date.now(),
            tableNumber: order.tableNumber,
            items,
            subtotal,
            tax,
            serviceCharge,
            grandTotal,
            paymentMethod: order.paymentMethod,
            createdBy: req.user.id
        });

        await invoice.save();

        res.json({
            message: "Invoice generated",
            invoiceId: invoice._id
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Fetch Invoice
router.get("/:id", auth, async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate("orderId");
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });

        res.json(invoice);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// GENERATE PDF BILL
router.get("/pdf/:id", auth, async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate("orderId");
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });

        const filePath = path.join(__dirname, `../generated/invoice-${invoice._id}.pdf`);

        await generatePDF(invoice, filePath);

        res.download(filePath);

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


module.exports = router;
