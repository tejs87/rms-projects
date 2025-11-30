import { Link, Outlet } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";


function DashboardLayout() {
  const user = getCurrentUser(); // may be null

  function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">RMS System</h2>
        <nav className="space-y-3">
          <Link to="/dashboard" className="block p-2">Dashboard</Link>
          {/* POS available to all logged in */}
          <Link to="/pos" className="block p-2">POS</Link>
          <Link to="/tables" className="block p-2 bg-gray-50 rounded hover:bg-gray-200">Table Management</Link>
          {/* KOT for kitchen/manager/admin */}
          {user && ['kitchen','manager','admin'].includes(user.role) && (
            <Link to="/kot" className="block p-2">KOT Orders</Link>
          )}
          {/* Menu, Inventory, Reports, Users for admin/manager */}
          {user && ['admin','manager'].includes(user.role) && (
            <>
              <Link to="/menu" className="block p-2">Menu Management</Link>
              <Link to="/inventory" className="block p-2">Inventory</Link>
              <Link to="/reports" className="block p-2">Reports</Link>
              <Link to="/users" className="block p-2">User Management</Link>
            </>
          )}
          {/* Deduction request for staff and above */}
          {user && ['staff','kitchen','manager','admin'].includes(user.role) && (
            <Link to="/deduction" className="block p-2">Manual Deduction</Link>
          )}
          {/* Deduction approval only for admin */}
          {user && user.role === 'admin' && (
            <Link to="/deduction-approval" className="block p-2">Deduction Approval</Link>
          )}
          <button
            onClick={logout}
            className="block p-2 bg-red-500 text-white rounded mt-4 w-full">
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
