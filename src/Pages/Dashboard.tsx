import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        setMessage("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage("Please fill all password fields.");
            return;
        }

        if (newPassword.length < 6) {
            setMessage("New password must be at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("New password and confirm password do not match.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("Please login first.");
            navigate("/");
            return;
        }

        setLoading(true);
        try {
            await api.post(
                "/auth/change-password",
                { currentPassword, newPassword },
                { headers: { Authorization: "Bearer " + token } }
            );
            setMessage("Password changed successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch {
            setMessage("Failed to change password. Check current password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Vehicle Parts Dashboard</h1>
            <p>Backend Connected Successfully</p>

            <h3>Change Password</h3>
            <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handleChangePassword} disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
            </button>

            {message && <p>{message}</p>}
        </div>
    );
}

export default Dashboard;