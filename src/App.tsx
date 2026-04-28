import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";

import Login from "./pages/Auth/Login";
import RegisterCustomer from "./pages/Auth/RegisterCustomer";

import AdminDashboard from "./pages/Admin/Dashboard";

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

            </Routes>
        </BrowserRouter>
    );
}

export default App;