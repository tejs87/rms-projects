import { useEffect, useState } from "react";
import api from "../api/axios";
import { PlusCircle, Pencil, Trash2, Search } from "lucide-react";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
  api.get("/inventory")
    .then(res => {
      const data = Array.isArray(res.data) ? res.data : res.data?.inventory || [];
      setInventory(data);
    })
    .catch(err => console.error("Inventory load error", err));
}, []);


  const getStatusBadge = (qty) => {
    if (qty === 0)
      return <span className="px-3 py-1 text-sm bg-red-500 text-white rounded-full">Out of Stock</span>;
    if (qty < 10)
      return <span className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-full">Low Stock</span>;
    return <span className="px-3 py-1 text-sm bg-green-600 text-white rounded-full">Available</span>;
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>

        <button className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg shadow hover:bg-green-700">
          <PlusCircle size={20} /> Add Item
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4 w-80">
        <input
          type="text"
          placeholder="Search Inventory..."
          className="w-full border rounded-lg p-2 pl-10 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
      </div>

      {/* Inventory Table */}
      <div className="bg-white p-4 shadow rounded-lg overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left border-b">
              <th className="p-3">Item Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {inventory
              .filter((item) =>
                (item?.name || "").toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">{getStatusBadge(item.quantity)}</td>

                  <td className="p-3 text-center flex justify-center gap-3">

                    <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      <Pencil size={18} />
                    </button>

                    <button className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                      <Trash2 size={18} />
                    </button>

                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
