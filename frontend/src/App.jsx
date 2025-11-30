import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import POS from "./pages/POS";
import KOT from "./pages/KOT";
import MenuPage from "./pages/Menu";
import InventoryPage from "./pages/Inventory";
import OrdersPage from "./pages/Orders";
import UsersPage from "./pages/Users";
import ReportsPage from "./pages/Reports";
import DeductionRequest from "./pages/DeductionRequest";
import DeductionApproval from "./pages/DeductionApproval";
import TableManagement from "./pages/TableManagement";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* All routes under dashboard layout require login */}
        <Route element={<DashboardLayout />}>
          {/* Public within auth: any logged-in user */}
          <Route element={<ProtectedRoute allowedRoles={[] /* any logged-in */} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/kot" element={<KOT />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/tables" element={<TableManagement />} />
          </Route>

          {/* Admin & Manager pages */}
          <Route element={<ProtectedRoute allowedRoles={['admin','manager']} />}>
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/users" element={<UsersPage />} />
            
          </Route>

          {/* Staff pages */}
          <Route element={<ProtectedRoute allowedRoles={['staff','kitchen','manager','admin']} />}>
            <Route path="/deduction" element={<DeductionRequest />} />
          </Route>

          {/* Admin approval only */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/deduction-approval" element={<DeductionApproval />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
