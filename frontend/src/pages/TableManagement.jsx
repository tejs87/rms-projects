// src/pages/TableManagement.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [seats, setSeats] = useState(4);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  const loadTables = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tables");
      setTables(res.data || []);
    } catch (err) {
      console.error("LOAD TABLES ERR:", err.response?.data || err);
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
    // eslint-disable-next-line
  }, []);

  const addTable = async () => {
    if (!tableNumber) return alert("Enter table number");
    try {
      await api.post("/tables", { tableNumber, seats: Number(seats) });
      setTableNumber("");
      setSeats(4);
      loadTables();
    } catch (err) {
      console.error("ADD TABLE ERR:", err.response?.data || err);
      alert(err.response?.data?.message || "Cannot add table");
    }
  };

  const deleteTable = async (id) => {
    if (!window.confirm("Delete this table?")) return;
    try {
      await api.delete(`/tables/${id}`);
      loadTables();
    } catch (err) {
      console.error("DELETE TABLE ERR:", err.response?.data || err);
      alert("Delete failed");
    }
  };

  const setStatus = async (id, status, orderId = null) => {
    try {
      await api.put(`/tables/${id}`, { status, currentOrderId: orderId });
      loadTables();
    } catch (err) {
      console.error("SET STATUS ERR:", err.response?.data || err);
      alert("Update failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Table Management</h1>

      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="font-semibold mb-2">Create Table</h2>
        <div className="flex gap-2 items-center">
          <input
            className="border p-2"
            placeholder="Table number (e.g., 1, A1)"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
          />
          <input
            className="border p-2 w-28"
            type="number"
            min="1"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={addTable}>
            Add Table
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">Seats field (for reference) — optional.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tables.map((t) => (
          <div key={t._id} className="bg-white rounded shadow p-4 border">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-lg font-bold">Table {t.tableNumber}</div>
                <div className="text-sm text-gray-500">Seats: {t.seats ?? "-"}</div>
                <div className="text-sm mt-2">
                  Status:{" "}
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      t.status === "occupied"
                        ? "bg-red-100 text-red-700"
                        : t.status === "reserved"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {t.status || "free"}
                  </span>
                </div>
                {t.currentOrderId && (
                  <div className="text-sm mt-1">
                    Current Order: <span className="font-medium">{t.currentOrderId}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {/* quick actions */}
                <button
                  onClick={() => setStatus(t._id, "free", null)}
                  className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                >
                  Mark Free
                </button>

                <button
                  onClick={() => setStatus(t._id, "occupied", t.currentOrderId ?? null)}
                  className="px-2 py-1 bg-red-600 text-white rounded text-sm"
                >
                  Mark Occupied
                </button>

                <button
                  onClick={() => setStatus(t._id, "reserved")}
                  className="px-2 py-1 bg-yellow-500 text-white rounded text-sm"
                >
                  Reserve
                </button>

                <button
                  onClick={() => deleteTable(t._id)}
                  className="px-2 py-1 bg-gray-300 text-black rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {tables.length === 0 && (
          <div className="col-span-full text-gray-500 p-4">No tables created yet.</div>
        )}
      </div>
    </div>
  );
}
