// src/pages/Reports.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function ReportsPage() {
  const [start, setStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7); // default last 7 days
    return d.toISOString().slice(0, 10);
  });
  const [end, setEnd] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const token = localStorage.getItem("token");

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/reports/sales?start=${start}&end=${end}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReport(res.data);
    } catch (err) {
      console.error("REPORT LOAD ERROR:", err.response?.data || err);
      alert("Could not load report. See console.");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // auto-load once on mount
    fetchReport();
    // eslint-disable-next-line
  }, []);

  const exportCSV = () => {
    if (!report) return alert("No data to export");
    const rows = [];

    rows.push(["Summary"]);
    rows.push(["Total Sales", report.totalSales ?? 0]);
    rows.push(["Orders Count", report.ordersCount ?? 0]);
    rows.push([]);
    rows.push(["Top Items"]);
    rows.push(["Name", "Quantity", "Revenue"]);
    (report.topItems || []).forEach((t) =>
      rows.push([t.name, t.qty ?? 0, t.revenue ?? 0])
    );
    rows.push([]);
    rows.push(["Orders"]);
    rows.push(["OrderId", "Table", "Total", "Status", "CreatedAt"]);
    (report.orders || []).forEach((o) =>
      rows.push([o._id, o.tableNumber, o.totalAmount, o.status, o.createdAt])
    );

    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rms-report-${start}_to_${end}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="flex items-end gap-4 mb-6">
        <div>
          <label className="block text-sm">Start date</label>
          <input className="border p-2" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm">End date</label>
          <input className="border p-2" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>

        <div>
          <button onClick={fetchReport} className="bg-blue-600 text-white px-4 py-2 rounded">Load Report</button>
        </div>

        <div>
          <button onClick={exportCSV} className="bg-gray-700 text-white px-4 py-2 rounded">Export CSV</button>
        </div>
      </div>

      {loading && <div>Loading...</div>}

      {!loading && report && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded shadow">
              <h3 className="text-sm text-gray-500">Total Sales</h3>
              <div className="text-2xl font-bold">₹{report.totalSales ?? 0}</div>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <h3 className="text-sm text-gray-500">Orders</h3>
              <div className="text-2xl font-bold">{report.ordersCount ?? 0}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Top Items</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-right">Quantity</th>
                  <th className="p-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {(report.topItems || []).map((t) => (
                  <tr key={t.name}>
                    <td className="p-2">{t.name}</td>
                    <td className="p-2 text-right">{t.qty ?? 0}</td>
                    <td className="p-2 text-right">₹{t.revenue ?? 0}</td>
                  </tr>
                ))}
                {(!report.topItems || report.topItems.length === 0) && (
                  <tr><td colSpan={3} className="p-4 text-center text-gray-500">No items</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Orders</h3>
            <div className="overflow-auto max-h-64">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Order</th>
                    <th className="p-2">Table</th>
                    <th className="p-2 text-right">Total</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {(report.orders || []).map((o) => (
                    <tr key={o._id}>
                      <td className="p-2 truncate max-w-xs">{o._id}</td>
                      <td className="p-2">{o.tableNumber}</td>
                      <td className="p-2 text-right">₹{o.totalAmount}</td>
                      <td className="p-2">{o.status}</td>
                      <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {!report.orders?.length && <tr><td colSpan={5} className="p-4 text-center text-gray-500">No orders</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!loading && !report && (
        <div className="text-gray-500">No data loaded. Click "Load Report".</div>
      )}
    </div>
  );
}
