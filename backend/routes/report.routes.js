// backend/routes/report.routes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// GET /api/reports/sales?start=YYYY-MM-DD&end=YYYY-MM-DD
// Requires admin or manager
router.get("/sales", auth, role(["admin","manager"]), async (req, res) => {
  try {
    const { start, end } = req.query;
    const startDate = start ? new Date(start) : new Date(0);
    const endDate = end ? new Date(end + "T23:59:59.999Z") : new Date();

    // fetch orders completed between dates (or include all statuses if you prefer)
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).lean();

    // compute totals and top items
    const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const ordersCount = orders.length;

    const itemsMap = {};
    for (const o of orders) {
      (o.items || []).forEach(it => {
        const name = it.name || "Unknown";
        if (!itemsMap[name]) itemsMap[name] = { name, qty: 0, revenue: 0 };
        itemsMap[name].qty += Number(it.quantity || 0);
        itemsMap[name].revenue += Number(it.price || 0) * Number(it.quantity || 0);
      });
    }
    const topItems = Object.values(itemsMap).sort((a,b) => b.qty - a.qty);

    res.json({ totalSales, ordersCount, topItems, orders });
  } catch (err) {
    console.error("REPORTS ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
