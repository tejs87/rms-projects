import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function BillingPending() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/orders/billing/pending")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Pending bills load error:", err));
  }, []);

  const openBilling = (orderId) => {
    navigate(`/billing?orderId=${orderId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Pending Bills</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No pending bills</p>
      ) : (
        <table className="w-full border shadow bg-white rounded">
          <thead>
            <tr className="bg-yellow-200 text-left">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Table</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b hover:bg-gray-100">
                <td className="p-2 border">{o._id}</td>

                <td className="p-2 border">Table {o.tableNumber}</td>

                <td className="p-2 border font-bold">₹{o.totalAmount}</td>

                <td className="p-2 border text-center">
                  <button
                    onClick={() => openBilling(o._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded shadow"
                  >
                    Complete Bill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
