// src/pages/Users.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");

  const token = localStorage.getItem("token");
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users"); // backend: GET /api/users
      setUsers(res.data || []);
    } catch (err) {
      console.error("LOAD USERS ERR:", err.response?.data || err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line
  }, []);

  const createUser = async () => {
    if (!name || !email || !password) return alert("Fill all fields");
    try {
      await api.post("/auth/register", { name, email, password, role }); // or /users depending on backend
      setName(""); setEmail(""); setPassword(""); setRole("staff");
      loadUsers();
      alert("User created");
    } catch (err) {
      console.error("CREATE USER ERR:", err.response?.data || err);
      alert(err.response?.data?.message || "Create failed");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`); // backend: DELETE /api/users/:id
      loadUsers();
    } catch (err) {
      console.error("DELETE USER ERR:", err.response?.data || err);
      alert("Delete failed");
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      await api.put(`/users/${id}`, { role: newRole }); // backend: PUT /api/users/:id
      loadUsers();
    } catch (err) {
      console.error("UPDATE ROLE ERR:", err.response?.data || err);
      alert("Update failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User / Staff Management</h1>

      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Create New User</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input className="border p-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="border p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="border p-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <select className="border p-2" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="staff">Staff</option>
            <option value="kitchen">Kitchen</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
            <option value="cashier">cashier</option>
            <option value="inventoryManager">inventoryManager</option>
          </select>
        </div>
        <div className="mt-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={createUser}>Create</button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-3">All Users</h2>
        {loading ? <div>Loading...</div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    <select value={u.role} onChange={(e)=>updateRole(u._id, e.target.value)} className="border p-1">
                      <option value="staff">Staff</option>
                      <option value="kitchen">Kitchen</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                      <option value="cashier">cashier</option>
                      <option value="inventoryManager">inventoryManager</option>
                    </select>
                  </td>
                  <td className="p-2 text-center">
                    <button onClick={()=>deleteUser(u._id)} className="text-sm bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-gray-500">No users yet</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
