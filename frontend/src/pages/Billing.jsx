import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Billing() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Billing Fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    if (!orderId) return;

    api
      .get(`/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="p-6">Loading Bill...</div>;
  if (!order) return <div className="p-6">Order not found.</div>;

  // Basic Calculations
  const subtotal = order.totalAmount || 0;
  const gst = subtotal * 0.05; // 5% GST
  const serviceCharge = subtotal * 0.1; // 10% service charge
  const discountAmount = (discount / 100) * subtotal;

  const grandTotal = subtotal + gst + serviceCharge - discountAmount;

  // Handle Payment
  const handlePayment = async () => {
    if (!paymentMethod) return alert("Please select payment method");

    try {
      await api.put(`/orders/pay/${orderId}`, {
        paymentMethod,
        customerName,
        customerPhone,
        discount: discountAmount,
        tax: gst,
        serviceCharge,
        grandTotal,
      });

      alert("Payment successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h1 className="text-3xl font-bold mb-4">Billing</h1>

      {/* Order & Table Info */}
      <div className="mb-3">
        <strong>Order ID:</strong> {orderId}
      </div>
      <div className="mb-3">
        <strong>Table:</strong> {order.tableNumber}
      </div>

      {/* Items */}
      <h2 className="font-bold text-lg mb-2">Items</h2>
      <ul className="border p-3 rounded mb-4">
        {order.items.map((it, i) => (
          <li key={i} className="flex justify-between border-b py-1">
            <span>
              {it.name} × {it.quantity}
            </span>
            <span>₹{(it.price * it.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      {/* Customer Info */}
      <h2 className="font-bold text-lg mb-2">Customer Details</h2>
      <input
        className="border p-2 w-full mb-2 rounded"
        type="text"
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-4 rounded"
        type="text"
        placeholder="Phone Number"
        value={customerPhone}
        onChange={(e) => setCustomerPhone(e.target.value)}
      />

      {/* Bill Breakdown */}
      <div className="space-y-1 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>GST (5%)</span>
          <span>₹{gst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Service Charge (10%)</span>
          <span>₹{serviceCharge.toFixed(2)}</span>
        </div>

        {/* Discount */}
        <div className="flex justify-between items-center">
          <span>Discount (%)</span>
          <input
            type="number"
            className="border p-1 w-20 rounded"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
        </div>

        <div className="flex justify-between font-bold text-xl mt-2">
          <span>Grand Total</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-4">
        <label className="font-semibold">Payment Method</label>
        <select
          className="border p-2 rounded w-full mt-1"
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="">Select...</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
        </select>
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        className="p-3 bg-green-600 w-full text-white rounded text-lg shadow hover:bg-green-700"
      >
        Pay & Complete Order
      </button>
    </div>
  );
}
