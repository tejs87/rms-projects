// src/pages/Orders.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null); // selected order
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const token = localStorage.getItem("token");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error("LOAD ORDERS ERROR:", err.response?.data || err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const openOrder = (order) => {
    setSelected(order);
  };

  const closeOrder = () => {
    setSelected(null);
    setPaymentMethod("cash");
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadOrders();
      if (selected && selected._id === id) {
        setSelected({ ...selected, status });
      }
    } catch (err) {
      console.error("UPDATE STATUS ERROR:", err.response?.data || err);
      alert("Could not update status");
    }
  };

  const payOrder = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/pay/${id}`,
        { paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Payment processed");
      loadOrders();
      closeOrder();
    } catch (err) {
      console.error("PAYMENT ERROR:", err.response?.data || err);
      alert("Payment failed");
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleString();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button
          onClick={loadOrders}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Refresh
        </button>
      </div>

      {loading && <div>Loading orders...</div>}

      <div className="grid gap-4">
        {orders.length === 0 && !loading && (
          <div className="text-gray-500">No orders found.</div>
        )}

        {orders.map((o) => (
          <div
            key={o._id}
            className="bg-white p-3 rounded shadow flex justify-between items-center"
          >
            <div>
              <div className="flex gap-3 items-baseline">
                <strong>Order:</strong>
                <span>#{o._id}</span>
                <span className="text-sm text-gray-500">Table {o.tableNumber}</span>
                <span className="text-sm text-gray-500">{formatDate(o.createdAt)}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Items: {o.items?.length || 0} • Total: ₹{o.totalAmount || 0}
              </div>
              <div className="mt-1">
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    o.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : o.status === "preparing"
                      ? "bg-blue-100 text-blue-700"
                      : o.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {o.status || "unknown"}
                </span>
                {o.isPaid && (
                  <span className="ml-2 px-2 py-0.5 rounded text-xs bg-green-50 text-green-700">
                    Paid
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={() => openOrder(o)}
                className="px-3 py-1 border rounded"
              >
                View
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    o._id,
                    o.status === "pending" ? "preparing" : "completed"
                  )
                }
                className="px-3 py-1 bg-indigo-600 text-white rounded"
              >
                {o.status === "pending" ? "Start" : "Complete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-over / modal for selected order */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center p-4 z-50">
          <div className="bg-white w-full md:w-3/4 lg:w-2/3 rounded shadow p-6 overflow-auto max-h-[90vh]">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">Order #{selected._id}</h2>
                <div className="text-sm text-gray-500">
                  Table {selected.tableNumber} • {formatDate(selected.createdAt)}
                </div>
              </div>

              <div className="flex gap-2">
                {!selected.isPaid && (
                  <button
                    onClick={() => payOrder(selected._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Pay Now
                  </button>
                )}
                <button onClick={closeOrder} className="px-3 py-1 border rounded">
                  Close
                </button>
              </div>
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Items</h3>
                <ul className="space-y-2">
                  {selected.items.map((it, idx) => (
                    <li key={idx} className="flex justify-between">
                      <div>
                        <div className="font-medium">{it.name}</div>
                        <div className="text-sm text-gray-500">
                          qty: {it.quantity} • price: ₹{it.price}
                        </div>
                      </div>
                      <div className="text-right">₹{it.quantity * it.price}</div>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 text-lg font-bold">Total: ₹{selected.totalAmount}</div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Payment</h3>

                {selected.isPaid ? (
                  <div>
                    <div className="mb-2">Already paid by: {selected.paymentMethod}</div>
                  </div>
                ) : (
                  <>
                    <div className="mb-2">
                      <label className="block mb-1 text-sm">Method</label>
                      <select
                        className="border p-2 w-full"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="upi">UPI</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => payOrder(selected._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Confirm Payment
                      </button>

                      <button
                        onClick={() => { navigator.clipboard?.writeText(JSON.stringify(selected, null, 2)); alert("Copied receipt JSON to clipboard") }}
                        className="px-3 py-1 border rounded"
                      >
                        Copy Receipt
                      </button>
                    </div>
                  </>
                )}

                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Order Meta</h4>
                  <div className="text-sm text-gray-600">
                    Created: {formatDate(selected.createdAt)}
                    <br />
                    Status: {selected.status}
                    <br />
                    Paid: {selected.isPaid ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
