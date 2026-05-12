import { useState } from "react";

import { useNavigate } from "react-router-dom";

import DashboardShell
    from "../../components/Admin/DashboardShell";

import api from "../../api/axios";

import {
    LayoutDashboard,
    Package,
    Truck,
    Users,
    FileText,
    BarChart3,
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

export default function AddVendor() {

    const navigate =
        useNavigate();

    const [vendorName, setVendorName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [phoneNumber, setPhoneNumber] =
        useState("");

    const [address, setAddress] =
        useState("");

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            await api.post(
                "/Vendor",
                {
                    vendorName,
                    email,
                    phoneNumber,
                    address,
                }
            );

            navigate("/admin/vendors");

        } catch (error) {

            console.error(error);
        }
    };

    return (

        <DashboardShell
            role="Admin"
            nav={adminNav}
        >

            <div className="max-w-3xl">

                <div className="mb-10">

                    <div className="text-[11px] tracking-[0.3em] uppercase text-[oklch(0.5_0.012_70)]">
                        Vendor Management
                    </div>

                    <h1 className="mt-3 text-5xl font-bold tracking-tight">
                        Add Vendor
                    </h1>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    <input
                        type="text"
                        placeholder="Vendor Name"
                        value={vendorName}
                        onChange={(e) =>
                            setVendorName(e.target.value)
                        }
                        className="w-full rounded-2xl border p-4"
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="w-full rounded-2xl border p-4"
                    />

                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) =>
                            setPhoneNumber(e.target.value)
                        }
                        className="w-full rounded-2xl border p-4"
                    />

                    <textarea
                        placeholder="Address"
                        value={address}
                        onChange={(e) =>
                            setAddress(e.target.value)
                        }
                        className="w-full rounded-2xl border p-4 h-32"
                    />

                    <button
                        type="submit"
                        className="rounded-2xl bg-[oklch(0.205_0.012_60)] text-white px-6 py-4"
                    >
                        Add Vendor
                    </button>

                </form>

            </div>

        </DashboardShell>
    );
}