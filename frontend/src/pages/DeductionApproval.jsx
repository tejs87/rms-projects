import { useEffect, useState } from "react";
import axios from "axios";

export default function DeductionApproval() {
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem("token");

  const loadRequests = () => {
    axios
      .get("http://localhost:5000/api/deduct/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLogs(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const approve = (id) => {
    axios
      .put(
        `http://localhost:5000/api/deduct/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => loadRequests());
  };

  const reject = (id) => {
    axios
      .put(
        `http://localhost:5000/api/deduct/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => loadRequests());
  };

  return (
    <div className="p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Deduction Requests</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Item</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Requested By</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td className="border p-2">{log.inventoryItemId?.name}</td>
              <td className="border p-2">{log.quantity}</td>
              <td className="border p-2">{log.reason}</td>
              <td className="border p-2">{log.requestedBy?.name}</td>
              <td className="border p-2">{log.status}</td>
              <td className="border p-2">
                {log.status === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => approve(log._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => reject(log._id)}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-500">Processed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
