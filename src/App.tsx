import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";

import Login from "./pages/Auth/Login";
import RegisterCustomer from "./pages/Auth/RegisterCustomer";

import AdminDashboard from "./pages/Admin/Dashboard";

import StaffDashboard from "./pages/Staff/StaffDashboard";
import { StaffLayout } from "./components/staff/StaffLayout";

import StaffCustomers from "./pages/Staff/StaffCustomers";
import StaffSales from "./pages/Staff/StaffSales";
import StaffInvoices from "./pages/Staff/StaffInvoices";
import StaffSearch from "./pages/Staff/StaffSearch";
import StaffReports from "./pages/Staff/StaffReports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterCustomer />} />

        {/* Normal Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Staff Dashboard */}
        {/* Staff Dashboard */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<StaffDashboard />} />
          <Route path="customers" element={<StaffCustomers />} />
          <Route path="sales" element={<StaffSales />} />
          <Route path="invoices" element={<StaffInvoices />} />
          <Route path="search" element={<StaffSearch />} />
          <Route path="reports" element={<StaffReports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
