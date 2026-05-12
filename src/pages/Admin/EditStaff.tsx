import { useState } from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import DashboardShell
    from "../../components/Admin/DashboardShell";

import api from "../../api/axios";
export default function EditStaff() {

    const navigate =
        useNavigate();

    const { id } =
        useParams();

    const [role, setRole] =
        useState("Staff");

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            await api.put(
                `/admin/staff/${id}/role`,
                { role }
            );

            navigate("/admin/staff");

        } catch (error) {

            console.error(error);
        }
    };

    return (

        <DashboardShell role="Admin" nav={[]}>

            <div className="max-w-xl mx-auto">

                <h1 className="text-4xl font-bold mb-8">
                    Edit Staff Role
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

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

                        Update Role

                    </button>

                </form>

            </div>

        </DashboardShell>
    );
}