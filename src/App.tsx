import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import PartsCatalogPage from "./pages/PartsCatalogPage";
import ContactPage from "./pages/ContactPage";

import Login from "./pages/Auth/Login";
import RegisterCustomer from "./pages/Auth/RegisterCustomer";

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
import PartRequests from "./pages/Admin/PartRequests";
import NotificationsPage from "./pages/Admin/Notifications";
import AddPart from "./pages/Admin/AddPart";
import EditPart from "./pages/Admin/EditPart";
import AddVendor from "./pages/Admin/AddVendor";
import EditVendor from "./pages/Admin/EditVendor";
import AddStaff from "./pages/Admin/AddStaff";
import EditStaff from "./pages/Admin/EditStaff";
import CreatePurchaseInvoice from "./pages/Admin/CreatePurchaseInvoice";

import CustomerDashboard from "./pages/Customer/CustomerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

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

                <Route
                    path="/staff"
                    element={
                        <ProtectedRoute allowedRoles={["Staff"]}>
                            <StaffLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<StaffDashboard />} />
                    <Route path="customers" element={<StaffCustomers />} />
                    <Route path="sales" element={<StaffSales />} />
                    <Route path="invoices" element={<StaffInvoices />} />
                    <Route path="search" element={<StaffSearch />} />
                    <Route path="reports" element={<StaffReports />} />
                </Route>

                <Route path="/admin" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/staff" element={<ProtectedRoute allowedRoles={["Admin"]}><StaffPage /></ProtectedRoute>} />
                <Route path="/admin/staff/add" element={<ProtectedRoute allowedRoles={["Admin"]}><AddStaff /></ProtectedRoute>} />
                <Route path="/admin/staff/edit/:id" element={<ProtectedRoute allowedRoles={["Admin"]}><EditStaff /></ProtectedRoute>} />
                <Route path="/admin/parts" element={<ProtectedRoute allowedRoles={["Admin"]}><PartsPage /></ProtectedRoute>} />
                <Route path="/admin/parts/add" element={<ProtectedRoute allowedRoles={["Admin"]}><AddPart /></ProtectedRoute>} />
                <Route path="/admin/parts/edit/:id" element={<ProtectedRoute allowedRoles={["Admin"]}><EditPart /></ProtectedRoute>} />
                <Route path="/admin/vendors" element={<ProtectedRoute allowedRoles={["Admin"]}><VendorsPage /></ProtectedRoute>} />
                <Route path="/admin/vendors/add" element={<ProtectedRoute allowedRoles={["Admin"]}><AddVendor /></ProtectedRoute>} />
                <Route path="/admin/vendors/edit/:id" element={<ProtectedRoute allowedRoles={["Admin"]}><EditVendor /></ProtectedRoute>} />
                <Route path="/admin/invoices" element={<ProtectedRoute allowedRoles={["Admin"]}><InvoicesPage /></ProtectedRoute>} />
                <Route path="/admin/invoices/create" element={<ProtectedRoute allowedRoles={["Admin"]}><CreatePurchaseInvoice /></ProtectedRoute>} />
                <Route path="/admin/purchase-invoice" element={<ProtectedRoute allowedRoles={["Admin"]}><CreatePurchaseInvoice /></ProtectedRoute>} />
                <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={["Admin"]}><ReportsPage /></ProtectedRoute>} />
                <Route path="/admin/customers" element={<ProtectedRoute allowedRoles={["Admin"]}><CustomersPage /></ProtectedRoute>} />
                <Route path="/admin/requests" element={<ProtectedRoute allowedRoles={["Admin"]}><PartRequests /></ProtectedRoute>} />
                <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={["Admin"]}><NotificationsPage /></ProtectedRoute>} />

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
                        element={
                            <ProtectedRoute allowedRoles={["Customer"]}>
                                <CustomerDashboard />
                            </ProtectedRoute>
                        }                    />
                ))}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
