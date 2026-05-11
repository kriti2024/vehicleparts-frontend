import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./Pages/HomePage";
import Dashboard from "./Pages/Dashboard";

import Login from "./Pages/Auth/Login";
import RegisterCustomer from "./Pages/Auth/RegisterCustomer";

import AdminDashboard from "./Pages/Admin/Dashboard";

import StaffDashboard from "./Pages/Staff/StaffDashboard";
import { StaffLayout } from "./components/staff/StaffLayout";

import StaffCustomers from "./Pages/Staff/StaffCustomers";
import StaffSales from "./Pages/Staff/StaffSales";
import StaffInvoices from "./Pages/Staff/StaffInvoices";
import StaffSearch from "./Pages/Staff/StaffSearch";
import StaffReports from "./Pages/Staff/StaffReports";

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
