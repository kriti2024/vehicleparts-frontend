import { useState } from "react";

import { useNavigate } from "react-router-dom";

import DashboardShell
    from "../../components/Admin/DashboardShell";

import api from "../../api/axios";

export default function AddStaff() {

    const navigate =
        useNavigate();

    const [fullName, setFullName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [role, setRole] =
        useState("Staff");

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            await api.post(
                "/admin/staff",
                {
                    fullName,
                    email,
                    password,
                    role,
                }
            );

            navigate("/admin/staff");

        } catch (error) {

            console.error(error);
        }
    };

    return (

        <DashboardShell role="Admin" nav={[]}>

            <div className="max-w-2xl mx-auto">

                <h1 className="text-4xl font-bold mb-8">
                    Add Staff
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) =>
                            setFullName(e.target.value)
                        }
                        className="w-full border rounded-xl p-4"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="w-full border rounded-xl p-4"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        className="w-full border rounded-xl p-4"
                    />

                    <select
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value)
                        }
                        className="w-full border rounded-xl p-4"
                    >

                        <option value="Staff">
                            Staff
                        </option>

                        <option value="Admin">
                            Admin
                        </option>

                    </select>

                    <button
                        type="submit"
                        className="bg-black text-white px-6 py-4 rounded-xl"
                    >

                        Create Staff

                    </button>

                </form>

            </div>

        </DashboardShell>
    );
}