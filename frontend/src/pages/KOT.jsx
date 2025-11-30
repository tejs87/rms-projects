import { useEffect, useState } from "react";

function KOT() {
  const [kots, setKots] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchKOTs = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/kot", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setKots(data);
      } else {
        alert(data.message || "Error loading KOTs");
      }
    } catch (err) {
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKOTs();
    // auto refresh every 10 seconds
    const interval = setInterval(fetchKOTs, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id, type) => {
    const url =
      type === "prepare"
        ? `http://localhost:5000/api/kot/prepare/${id}`
        : `http://localhost:5000/api/kot/complete/${id}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();

    if (res.ok) {
      fetchKOTs();
    } else {
      alert(data.message || "Error updating status");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Kitchen KOT Screen</h1>
        <button
          onClick={fetchKOTs}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Refresh
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kots.map((kot) => (
          <div
            key={kot._id}
            className="bg-white shadow rounded p-4 border border-gray-200"
          >
            <div className="flex justify-between mb-2">
              <span className="font-bold">{kot.kotNumber || "KOT"}</span>
              <span className="text-sm text-gray-500">
                Table: {kot.tableNumber}
              </span>
            </div>

            <div className="mb-2">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  kot.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : kot.status === "preparing"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {kot.status.toUpperCase()}
              </span>
            </div>

            <div className="mb-3">
              <ul className="list-disc pl-5 text-sm">
                {kot.items?.map((item, idx) => (
                  <li key={idx}>
                    {item.name} x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              {kot.status === "pending" && (
                <button
                  onClick={() => updateStatus(kot._id, "prepare")}
                  className="flex-1 bg-yellow-500 text-white py-1 rounded text-sm"
                >
                  Mark Preparing
                </button>
              )}

              {kot.status !== "completed" && (
                <button
                  onClick={() => updateStatus(kot._id, "complete")}
                  className="flex-1 bg-green-600 text-white py-1 rounded text-sm"
                >
                  Mark Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {kots.length === 0 && !loading && (
        <p className="text-gray-500 mt-4">No KOTs available.</p>
      )}
    </div>
  );
}

export default KOT;
