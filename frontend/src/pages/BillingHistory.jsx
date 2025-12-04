import { useEffect, useState } from "react";
import api from "../api/axios";

export default function BillingHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api
      .get("/orders/billing/history")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Billing history load error:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Billing History</h1>

      {orders.length === 0 ? (
        <p>No billing records found</p>
      ) : (
        <table className="w-full border shadow rounded bg-white">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">Invoice</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Method</th>
              <th className="p-2 border">Paid At</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b hover:bg-gray-100">
                <td className="p-2 border">{o.invoiceNumber}</td>

                <td className="p-2 border">
                  {o.customerName || "N/A"}  
                  <br />
                  <span className="text-sm text-gray-600">{o.customerPhone}</span>
                </td>

                <td className="p-2 border font-bold">₹{o.grandTotal}</td>

                <td className="p-2 border">{o.paymentMethod}</td>

                <td className="p-2 border">
                  {new Date(o.paidAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
