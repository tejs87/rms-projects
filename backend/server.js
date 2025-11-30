const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const staffRoutes = require("./routes/staff.routes");
const invoiceRoutes = require("./routes/invoice.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/menu", require("./routes/menu.routes"));
app.use("/api/inventory", require("./routes/inventory.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/deduct", require("./routes/deduct.routes"));
app.use("/api/reports", require("./routes/report.routes"));
app.use("/api/tables", require("./routes/table.routes"));
app.use("/api/bills", require("./routes/bill.routes"));
app.use("/api/kot", require("./routes/kot.routes"));
app.use("/api/staff", staffRoutes);
app.use("/api/feedback", require("./routes/feedback.routes"));
app.use("/api/invoice", invoiceRoutes);
app.use("/api/dashboard", dashboardRoutes);


// Test route
app.get("/", (req, res) => {
    res.send("Restaurant Management System Backend Running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
