import { useEffect, useState } from "react";
import axios from "axios";

export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const token = localStorage.getItem("token");

  // Load menu
  useEffect(() => {
    axios.get("http://localhost:5000/api/menu", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      setMenu(res.data);
    })
    .catch((err) => {
      console.log("MENU ERROR:", err.response?.data || err);
    });
  }, []);

  const addMenu = () => {
    axios.post(
      "http://localhost:5000/api/menu",
      { name, price },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    .then(() => {
      setName("");
      setPrice("");
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Menu Management</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          className="border p-2"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button onClick={addMenu} className="bg-blue-600 text-white px-4 rounded">
          Add Item
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
          </tr>
        </thead>

        <tbody>
          {menu.map((item) => (
            <tr key={item._id}>
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">₹{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
