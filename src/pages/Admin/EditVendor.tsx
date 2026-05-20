import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

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

export default function EditVendor() {

    const { id } =
        useParams();

    const navigate =
        useNavigate();

    const [vendorName, setVendorName] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [address, setAddress] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const fetchVendor = async () => {

            try {

                const response =
                    await api.get(
                        `/Vendor/${id}`
                    );

                const vendor =
                    response.data;

                setVendorName(
                    vendor.vendorName ?? ""
                );

                setPhone(
                    vendor.phone ?? ""
                );

                setAddress(
                    vendor.address ?? ""
                );

            } catch (error) {

                console.error(error);
            }

            finally {

                setLoading(false);
            }
        };

        fetchVendor();

    }, [id]);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            await api.put(
                `/Vendor/${id}`,
                {
                    vendorId:
                        Number(id),

                    vendorName,

                    phone,

                    address,
                }
            );

            navigate("/admin/vendors");

        } catch (error) {

            console.error(error);
        }
    };

    if (loading) {

        return (
            <div className="min-h-screen grid place-items-center">
                Loading vendor...
            </div>
        );
    }

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
                        Edit Vendor
                    </h1>

                    <p className="mt-3 text-[oklch(0.5_0.012_70)]">
                        Update vendor details and supplier information.
                    </p>

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
                        className="w-full rounded-2xl border border-[oklch(0.88_0.012_80)] p-4 outline-none focus:ring-2 focus:ring-black/10"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) =>
                            setPhone(e.target.value)
                        }
                        className="w-full rounded-2xl border border-[oklch(0.88_0.012_80)] p-4 outline-none focus:ring-2 focus:ring-black/10"
                    />

                    <textarea
                        placeholder="Address"
                        value={address}
                        onChange={(e) =>
                            setAddress(e.target.value)
                        }
                        className="w-full rounded-2xl border border-[oklch(0.88_0.012_80)] p-4 h-32 outline-none focus:ring-2 focus:ring-black/10"
                    />

                    <div className="flex items-center gap-4">

                        <button
                            type="submit"
                            className="rounded-2xl bg-[oklch(0.205_0.012_60)] text-white px-6 py-4 text-sm font-semibold hover:opacity-90 transition"
                        >
                            Update Vendor
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/admin/vendors")
                            }
                            className="rounded-2xl border border-[oklch(0.88_0.012_80)] px-6 py-4 text-sm font-semibold hover:bg-[oklch(0.97_0.003_80)] transition"
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        </DashboardShell>
    );
}