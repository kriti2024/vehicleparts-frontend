import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import DashboardShell
    from "../../components/Admin/DashboardShell";

import DataCard
    from "../../components/Admin/DataCard";

import {
    getAllStaff,
    deleteStaff,
} from "../../api/admin";

import {
    LayoutDashboard,
    Package,
    Truck,
    Users,
    FileText,
    BarChart3,
    Plus,
    Pencil,
    Trash2,
} from "lucide-react";

const adminNav = [
    {
        to: "/admin/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        to: "/admin/parts",
        label: "Parts",
        icon: Package,
    },
    {
        to: "/admin/vendors",
        label: "Vendors",
        icon: Truck,
    },
    {
        to: "/admin/staff",
        label: "Staff",
        icon: Users,
    },
    {
        to: "/admin/customers",
        label: "Customers",
        icon: Users,
    },
    {
        to: "/admin/invoices",
        label: "Invoices",
        icon: FileText,
    },
    {
        to: "/admin/reports",
        label: "Reports",
        icon: BarChart3,
    },
];

type Staff = {
    id: string;
    fullName: string;
    email: string;
    roles: string[];
};
export default function StaffPage() {

    const navigate =
        useNavigate();

    const [staff, setStaff] =
        useState<Staff[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const fetchStaff = async () => {

            try {

                const data =
                    await getAllStaff();

                setStaff(data);

            } catch (error) {

                console.error(error);
            }

            finally {

                setLoading(false);
            }
        };

        fetchStaff();

    }, []);

    const handleDelete = async (
        id: string
    ) => {

        const confirmed =
            window.confirm(
                "Delete this staff?"
            );

        if (!confirmed)
            return;

        try {

            await deleteStaff(id);

            setStaff((prev) =>
                prev.filter(
                    (s) => s.id !== id
                )
            );

        } catch (error) {

            console.error(error);
        }
    };

    if (loading) {

        return (
            <div className="min-h-screen grid place-items-center">
                Loading staff...
            </div>
        );
    }

    return (

        <DashboardShell
            role="Admin"
            nav={adminNav}
        >

            <div>

                <div className="flex items-end justify-between mb-10">

                    <div>

                        <div className="text-[11px] uppercase tracking-[0.3em] text-gray-500">
                            Staff Management
                        </div>

                        <h1 className="text-5xl font-bold mt-3">
                            Staff
                        </h1>

                    </div>

                    <button
                        onClick={() =>
                            navigate("/admin/staff/add")
                        }
                        className="rounded-full bg-black text-white px-6 py-3 inline-flex items-center gap-2"
                    >

                        <Plus className="h-4 w-4" />

                        Add Staff

                    </button>

                </div>

                <DataCard title="Team Members">

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead>

                                <tr className="border-b">

                                    <th className="py-4 text-left">
                                        Name
                                    </th>

                                    <th className="py-4 text-left">
                                        Email
                                    </th>

                                    <th className="py-4 text-left">
                                        Role
                                    </th>

                                    <th className="py-4 text-right">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {staff.map((s) => (

                                    <tr
                                        key={s.id}
                                        className="border-b"
                                    >

                                        <td className="py-4">
                                            {s.fullName}
                                        </td>

                                        <td className="py-4">
                                            {s.email}
                                        </td>

                                        <td className="py-4">
                                            {s.roles?.join(", ")}                                        </td>

                                        <td className="py-4">

                                            <div className="flex justify-end gap-2">

                                                {s.roles?.includes("Admin") ? (

                                                    <span className="text-xs text-gray-400 px-2">
                                                        Admin
                                                    </span>

                                                ) : (

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/staff/edit/${s.id}`
                                                            )
                                                        }
                                                        className="h-10 w-10 rounded-xl hover:bg-gray-100 grid place-items-center"
                                                    >

                                                        <Pencil className="h-4 w-4" />

                                                    </button>

                                                )}
                                                {s.roles?.includes("Admin") ? (

                                                    <span className="text-xs text-gray-400">
                                                        Protected
                                                    </span>

                                                ) : (

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(s.id)
                                                        }
                                                        className="h-10 w-10 rounded-xl text-red-500 hover:bg-red-100 grid place-items-center"
                                                    >

                                                        <Trash2 className="h-4 w-4" />

                                                    </button>

                                                )}
                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </DataCard>

            </div>

        </DashboardShell>
    );
}