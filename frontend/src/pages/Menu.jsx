// src/pages/Menu.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const res = await api.get("/menu");
      setMenu(res.data);
    } catch (err) {
      console.error("MENU ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Menu load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMenu(); }, []);

  const openEdit = (item) => { setEditItem(item); setShowForm(true); };
  const openCreate = () => { setEditItem(null); setShowForm(true); };

  const deleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;
    try { await api.delete(`/menu/${id}`); loadMenu(); }
    catch (err) { console.error(err); alert("Delete failed"); }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded">+ Add</button>
      </div>

      <div className="bg-white rounded shadow p-4">
        {loading ? <div>Loading...</div> : (
          <div className="grid grid-cols-3 gap-4">
            {menu.map(m => (
              <div key={m._id} className="border p-3 rounded">
                <div className="font-bold">{m.name}</div>
                <div>₹{m.price}</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={()=>openEdit(m)} className="px-2 py-1 bg-yellow-300 rounded">Edit</button>
                  <button onClick={()=>deleteItem(m._id)} className="px-2 py-1 bg-red-400 text-white rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <MenuForm item={editItem} onClose={()=>{ setShowForm(false); loadMenu(); }} />
      )}
    </div>
  );
}

// inline small MenuForm for speed (paste below same file or make component)
function MenuForm({ item, onClose }) {
  const [name, setName] = useState(item?.name || "");
  const [price, setPrice] = useState(item?.price || "");
  useEffect(()=>{ setName(item?.name||""); setPrice(item?.price||""); }, [item]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (item) await api.put(`/menu/${item._id}`, { name, price });
      else await api.post("/menu", { name, price });
      onClose();
    } catch (err) { console.error(err); alert("Save failed"); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-3">{item ? "Edit" : "Add"} Menu Item</h2>
        <form onSubmit={submit} className="space-y-3">
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full border p-2 rounded" placeholder="Name" />
          <input value={price} onChange={e=>setPrice(e.target.value)} className="w-full border p-2 rounded" placeholder="Price" type="number" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
            <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
