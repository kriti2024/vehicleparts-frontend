import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";

// Auth
import Login from "./pages/Auth/Login";
import RegisterCustomer from "./pages/Auth/RegisterCustomer";

// Staff Pages
import StaffDashboard from "./pages/Staff/StaffDashboard";
import StaffCustomers from "./pages/Staff/StaffCustomers";
import StaffSales from "./pages/Staff/StaffSales";
import StaffInvoices from "./pages/Staff/StaffInvoices";
import StaffSearch from "./pages/Staff/StaffSearch";
import StaffReports from "./pages/Staff/StaffReports";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Staff from "./pages/Admin/Staff";
import Parts from "./pages/Admin/Parts";
import Vendors from "./pages/Admin/Vendors";
import Invoices from "./pages/Admin/Invoices";
import Reports from "./pages/Admin/Reports";
import AddPart from "./pages/Admin/AddPart";
import EditPart from "./pages/Admin/EditPart";
import AddVendor from "./pages/Admin/AddVendor";
import EditVendor from "./pages/Admin/EditVendor";
import AddStaff from "./pages/Admin/AddStaff";
import EditStaff from "./pages/Admin/EditStaff";
import CreatePurchaseInvoice from "./pages/Admin/CreatePurchaseInvoice";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterCustomer />} />

        {/* Staff Routes */}
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff/customers" element={<StaffCustomers />} />
        <Route path="/staff/sales" element={<StaffSales />} />
        <Route path="/staff/invoices" element={<StaffInvoices />} />
        <Route path="/staff/search" element={<StaffSearch />} />
        <Route path="/staff/reports" element={<StaffReports />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/staff" element={<Staff />} />
        <Route path="/admin/parts" element={<Parts />} />
        <Route path="/admin/vendors" element={<Vendors />} />
        <Route path="/admin/invoices" element={<Invoices />} />
        <Route path="/admin/reports" element={<Reports />} />

        <Route path="/admin/parts/add" element={<AddPart />} />
        <Route path="/admin/parts/edit/:id" element={<EditPart />} />

        <Route path="/admin/vendors/add" element={<AddVendor />} />
        <Route path="/admin/vendors/edit/:id" element={<EditVendor />} />

        <Route path="/admin/staff/add" element={<AddStaff />} />
        <Route path="/admin/staff/edit/:id" element={<EditStaff />} />

        <Route
          path="/admin/purchase-invoice"
          element={<CreatePurchaseInvoice />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
