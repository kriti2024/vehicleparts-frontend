import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Login from "./pages/Auth/Login";
import RegisterCustomer from "./pages/Auth/RegisterCustomer";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import PartsCatalogPage from "./pages/PartsCatalogPage";
import ContactPage from "./pages/ContactPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PartsPage from "./pages/Admin/Parts";
import EditPart from "./pages/Admin/EditPart";
import AddPart from "./pages/Admin/AddPart";
import VendorsPage from "./pages/Admin/Vendors";
import AddVendor from "./pages/Admin/AddVendor";
import EditVendor from "./pages/Admin/EditVendor";
import StaffPage from "./pages/Admin/Staff";
import EditStaff from "./pages/Admin/EditStaff";
import AddStaff from "./pages/Admin/AddStaff";
import InvoicesPage from "./pages/Admin/Invoices";
import CreatePurchaseInvoice from "./pages/Admin/CreatePurchaseInvoice";
import ReportsPage from "./pages/Admin/Reports";
import CustomersPage from "./pages/Admin/Customers";
import CustomerDashboard from "./pages/Customer/CustomerDashboard";
function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Home */}
                <Route path="/" element={<HomePage />} />

                {/* Services */}
                <Route
                    path="/services"
                    element={<ServicesPage />}
                />

                {/* About */}
                <Route
                    path="/about"
                    element={<AboutPage />}
                />

                <Route
                    path="/parts"
                    element={<PartsCatalogPage />}
                />

                <Route
                    path="/contact"
                    element={<ContactPage />}
                />

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterCustomer />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />


                {/* Admin Dashboard */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route
                    path="/admin/parts"
                    element={<PartsPage />}
                />
                <Route
                    path="/admin/parts/add"
                    element={<AddPart />}
                />
                <Route
                    path="/admin/parts/edit/:id"
                    element={<EditPart />}
                />

                <Route
                    path="/admin/vendors"
                    element={<VendorsPage />}
                />

                <Route
                    path="/admin/vendors/add"
                    element={<AddVendor />}
                />

                <Route
                    path="/admin/vendors/edit/:id"
                    element={<EditVendor />}
                />

                <Route
                    path="/admin/staff"
                    element={<StaffPage />}
                />

                <Route
                    path="/admin/staff/add"
                    element={<AddStaff />}
                />

                <Route
                    path="/admin/staff/edit/:id"
                    element={<EditStaff />}
                />

                <Route
                    path="/admin/invoices"
                    element={<InvoicesPage />}
                />

                <Route
                    path="/admin/invoices/create"
                    element={<CreatePurchaseInvoice />}
                />

                <Route
                    path="/admin/reports"
                    element={<ReportsPage />}
                />

                <Route
                    path="/admin/customers"
                    element={<CustomersPage />}
                />

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
