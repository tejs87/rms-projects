import { useEffect, useState } from "react";
import axios from "axios";

export default function DeductionRequest() {
  const [inventory, setInventory] = useState([]);
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setInventory(res.data))
      .catch((err) => console.log(err));
  }, []);

  const submitRequest = () => {
    if (!itemId || !quantity || !reason) {
      alert("Please fill all fields");
      return;
    }

    axios
      .post(
        "http://localhost:5000/api/deduct/request",
        { inventoryItemId: itemId, quantity, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("Request submitted to admin");
        setItemId("");
        setQuantity("");
        setReason("");
      })
      .catch((err) => {
        alert("Error: " + err.response?.data?.message);
      });
  };

  return (
    <div className="p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Manual Deduction Request</h1>

      <select
        className="border p-2 w-full mb-3"
        value={itemId}
        onChange={(e) => setItemId(e.target.value)}
      >
        <option value="">Select Inventory Item</option>
        {inventory.map((i) => (
          <option key={i._id} value={i._id}>
            {i.name} (Qty: {i.quantity} {i.unit})
          </option>
        ))}
      </select>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Quantity to deduct"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-3"
        placeholder="Reason for deduction"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      ></textarea>

      <button
        className="bg-blue-600 text-white p-2 rounded w-full"
        onClick={submitRequest}
      >
        Submit Request
      </button>
    </div>
  );
}
