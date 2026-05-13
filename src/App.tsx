import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import PartsCatalogPage from "./pages/PartsCatalogPage";
import ContactPage from "./pages/ContactPage";

import Login from "./pages/Auth/Login";
import RegisterCustomer from "./pages/Auth/RegisterCustomer";
import ForgotPassword from "./pages/Auth/ForgotPassword";

import { StaffLayout } from "./components/staff/StaffLayout";
import StaffDashboard from "./pages/Staff/StaffDashboard";
import StaffCustomers from "./pages/Staff/StaffCustomers";
import StaffSales from "./pages/Staff/StaffSales";
import StaffInvoices from "./pages/Staff/StaffInvoices";
import StaffSearch from "./pages/Staff/StaffSearch";
import StaffReports from "./pages/Staff/StaffReports";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import StaffPage from "./pages/Admin/Staff";
import PartsPage from "./pages/Admin/Parts";
import VendorsPage from "./pages/Admin/Vendors";
import InvoicesPage from "./pages/Admin/Invoices";
import ReportsPage from "./pages/Admin/Reports";
import CustomersPage from "./pages/Admin/Customers";
import AddPart from "./pages/Admin/AddPart";
import EditPart from "./pages/Admin/EditPart";
import AddVendor from "./pages/Admin/AddVendor";
import EditVendor from "./pages/Admin/EditVendor";
import AddStaff from "./pages/Admin/AddStaff";
import EditStaff from "./pages/Admin/EditStaff";
import CreatePurchaseInvoice from "./pages/Admin/CreatePurchaseInvoice";

import CustomerDashboard from "./pages/Customer/CustomerDashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/parts" element={<PartsCatalogPage />} />
                <Route path="/contact" element={<ContactPage />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterCustomer />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route path="/staff" element={<StaffLayout />}>
                    <Route index element={<StaffDashboard />} />
                    <Route path="customers" element={<StaffCustomers />} />
                    <Route path="sales" element={<StaffSales />} />
                    <Route path="invoices" element={<StaffInvoices />} />
                    <Route path="search" element={<StaffSearch />} />
                    <Route path="reports" element={<StaffReports />} />
                </Route>

                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/staff" element={<StaffPage />} />
                <Route path="/admin/staff/add" element={<AddStaff />} />
                <Route path="/admin/staff/edit/:id" element={<EditStaff />} />
                <Route path="/admin/parts" element={<PartsPage />} />
                <Route path="/admin/parts/add" element={<AddPart />} />
                <Route path="/admin/parts/edit/:id" element={<EditPart />} />
                <Route path="/admin/vendors" element={<VendorsPage />} />
                <Route path="/admin/vendors/add" element={<AddVendor />} />
                <Route path="/admin/vendors/edit/:id" element={<EditVendor />} />
                <Route path="/admin/invoices" element={<InvoicesPage />} />
                <Route path="/admin/invoices/create" element={<CreatePurchaseInvoice />} />
                <Route path="/admin/purchase-invoice" element={<CreatePurchaseInvoice />} />
                <Route path="/admin/reports" element={<ReportsPage />} />
                <Route path="/admin/customers" element={<CustomersPage />} />

                {[
                    "/customer/dashboard",
                    "/customer/profile",
                    "/customer/appointments",
                    "/customer/catalog",
                    "/customer/parts",
                    "/customer/payments",
                    "/customer/support",
                    "/customer/notifications",
                    "/customer/history",
                ].map((path) => (
                    <Route
                        key={path}
                        path={path}
                        element={<CustomerDashboard />}
                    />
                ))}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
