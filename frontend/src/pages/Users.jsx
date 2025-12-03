// src/pages/Users.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import UserForm from "../components/UserForm";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null); // for edit
  const [showForm, setShowForm] = useState(false);

  const pageSize = 10;

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users", { params: { q, page, limit: pageSize } });
      // expected: { data: usersArray, page, totalPages }
      setUsers(res.data.data || res.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("LOAD USERS ERR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Users load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line
  }, [q, page]);

  const openCreate = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const openEdit = (u) => {
    setSelectedUser(u);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      alert("Deleted");
      loadUsers();
    } catch (err) {
      console.error("DELETE ERR:", err.response?.data || err.message);
      alert("Delete failed");
    }
  };

  const toggleStatus = async (id, current) => {
    try {
      await api.put(`/users/status/${id}`, { active: !current });
      loadUsers();
    } catch (err) {
      console.error("STATUS ERR:", err.response?.data || err.message);
    }
  };

  const onFormSaved = () => {
    setShowForm(false);
    loadUsers();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add User
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          placeholder="Search by name or email"
          className="border p-2 rounded w-1/3"
        />
      </div>

      <div className="bg-white rounded shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-4">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" className="p-4">No users found</td></tr>
            ) : users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  <button
                    onClick={() => toggleStatus(u._id, u.active)}
                    className={`px-2 py-1 rounded ${u.active ? "bg-green-200" : "bg-red-200"}`}
                  >
                    {u.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => openEdit(u)} className="px-2 py-1 bg-yellow-300 rounded">Edit</button>
                  <button onClick={() => handleDelete(u._id)} className="px-2 py-1 bg-red-400 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 flex justify-between items-center">
          <div>Page {page} of {totalPages}</div>
          <div className="flex gap-2">
            <button disabled={page<=1} onClick={() => setPage(p => p-1)} className="px-3 py-1 border rounded">Prev</button>
            <button disabled={page>=totalPages} onClick={() => setPage(p => p+1)} className="px-3 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>

      {showForm && (
        <UserForm user={selectedUser} onClose={() => setShowForm(false)} onSaved={onFormSaved} />
      )}
    </div>
  );
}
