// src/components/UserForm.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function UserForm({ user = null, onClose, onSaved }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(""); // for create or change
  const [role, setRole] = useState(user?.role || "staff");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setRole(user?.role || "staff");
    setPassword("");
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !email) return alert("Name and email required");
    try {
      setLoading(true);
      if (user) {
        // edit
        await api.put(`/users/${user._id}`, { name, email, role, ...(password ? { password } : {}) });
        alert("Updated");
      } else {
        // create
        if (!password) return alert("Password is required for new user");
        await api.post("/users", { name, email, password, role });
        alert("Created");
      }
      onSaved && onSaved();
    } catch (err) {
      console.error("USER SAVE ERR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">{user ? "Edit User" : "Add User"}</h2>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm">Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm">Password {user ? "(leave blank to keep)" : ""}</label>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm">Role</label>
            <select value={role} onChange={e=>setRole(e.target.value)} className="w-full border p-2 rounded">
              <option value="admin">admin</option>
              <option value="manager">manager</option>
              <option value="kitchen">kitchen</option>
              <option value="staff">staff</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
