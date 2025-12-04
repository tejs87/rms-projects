import { NavLink, Outlet } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import {
  Home,
  UtensilsCrossed,
  BookOpen,
  ListOrdered,
  MenuSquare,
  Receipt,
  Wallet,
  History,
  CircleDot,
  UserCog,
  LogOut,
  ChevronDown,
  ChevronUp,
  ClipboardList
} from "lucide-react";
import { useState } from "react";

function DashboardLayout() {
  const user = getCurrentUser();

  const [billingOpen, setBillingOpen] = useState(false);
  const [deductionOpen, setDeductionOpen] = useState(false);

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <div className="flex h-screen bg-gray-100">

      {/* -------------------- Sidebar -------------------- */}
      <aside className="w-64 bg-white shadow-xl p-5 border-r border-gray-200 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          RMS System
        </h2>

        <nav className="space-y-2">

          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-100"
              }`
            }
          >
            <Home size={20} /> Dashboard
          </NavLink>

          {/* POS */}
          <NavLink
            to="/pos"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-100"
              }`
            }
          >
            <UtensilsCrossed size={20} /> POS
          </NavLink>

          {/* Table Management */}
          <NavLink
            to="/tables"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-100"
              }`
            }
          >
            <BookOpen size={20} /> Table Management
          </NavLink>

          {/* KOT (kitchen/manager/admin only) */}
          {user && ["kitchen", "manager", "admin"].includes(user.role) && (
            <NavLink
              to="/kot"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-100"
                }`
              }
            >
              <ListOrdered size={20} /> KOT Orders
            </NavLink>
          )}

          {/* Admin/Manager Management Options */}
          {user && ["admin", "manager"].includes(user.role) && (
            <>
              <NavLink
                to="/menu"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition ${
                    isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-100"
                  }`
                }
              >
                <MenuSquare size={20} /> Menu Management
              </NavLink>

              <NavLink
                to="/inventory"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition ${
                    isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-100"
                  }`
                }
              >
                <CircleDot size={20} /> Inventory
              </NavLink>

              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition ${
                    isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-100"
                  }`
                }
              >
                <History size={20} /> Reports
              </NavLink>

              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition ${
                    isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-100"
                  }`
                }
              >
                <UserCog size={20} /> User Management
              </NavLink>
            </>
          )}

          {/* ---------------- Billing Dropdown ---------------- */}
          <button
            onClick={() => setBillingOpen(!billingOpen)}
            className="flex items-center justify-between w-full p-3 rounded-lg text-gray-800 hover:bg-green-100 transition"
          >
            <span className="flex items-center gap-3">
              <Receipt size={20} /> Billing
            </span>
            {billingOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {billingOpen && (
            <div className="ml-6 space-y-2 mt-1">
              <NavLink
                to="/billing-history"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg transition ${
                    isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-200"
                  }`
                }
              >
                <History size={18} /> Billing History
              </NavLink>

              <NavLink
                to="/billing-pending"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg transition ${
                    isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-200"
                  }`
                }
              >
                <Wallet size={18} /> Pending Bills
              </NavLink>

              <NavLink
                to="/billing"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg transition ${
                    isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-200"
                  }`
                }
              >
                <Receipt size={18} /> Create Bill
              </NavLink>
            </div>
          )}

          {/* ---------------- Deductions Dropdown ---------------- */}
          {(user && ["staff", "kitchen", "manager", "admin"].includes(user.role)) && (
            <>
              <button
                onClick={() => setDeductionOpen(!deductionOpen)}
                className="flex items-center justify-between w-full p-3 rounded-lg text-gray-800 hover:bg-green-100 transition"
              >
                <span className="flex items-center gap-3">
                  <Wallet size={20} /> Deductions
                </span>
                {deductionOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {deductionOpen && (
                <div className="ml-6 space-y-2 mt-1">
                  <NavLink
                    to="/deduction"
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-2 rounded-lg transition ${
                        isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-200"
                      }`
                    }
                  >
                    <ClipboardList size={18} /> Manual Deduction
                  </NavLink>

                  {user.role === "admin" && (
                    <NavLink
                      to="/deduction-approval"
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-2 rounded-lg transition ${
                          isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-200"
                        }`
                      }
                    >
                      <History size={18} /> Deduction Approval
                    </NavLink>
                  )}
                </div>
              )}
            </>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-3 p-3 bg-red-500 text-white rounded-lg w-full mt-4 hover:bg-red-600"
          >
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>

      {/* -------------------- Main Content -------------------- */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
