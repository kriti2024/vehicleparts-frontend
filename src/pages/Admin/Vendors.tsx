import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import DashboardShell
    from "../../components/Admin/DashboardShell";

import DataCard
    from "../../components/Admin/DataCard";

import StatCard
    from "../../components/Admin/StatCard";

import {
    getAllVendors,
    deleteVendor,
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
    Mail,
    Phone,
    MapPin,
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

type Vendor = {
    vendorId: number;
    vendorName: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    totalParts?: number;
};

export default function VendorsPage() {

    const navigate =
        useNavigate();

    const [vendors, setVendors] =
        useState<Vendor[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const fetchVendors = async () => {

            try {

                const data =
                    await getAllVendors();

                setVendors(data);

            } catch (error) {

                console.error(error);
            }

            finally {

                setLoading(false);
            }
        };

        fetchVendors();

    }, []);

    const handleDelete = async (
        id: number
    ) => {

        const confirmed =
            window.confirm(
                "Delete this vendor?"
            );

        if (!confirmed)
            return;

        try {

            await deleteVendor(id);

            setVendors((prev) =>
                prev.filter(
                    (v) => v.vendorId !== id
                )
            );

        } catch (error) {

            console.error(error);
        }
    };

    if (loading) {

        return (
            <div className="min-h-screen grid place-items-center">
                Loading vendors...
            </div>
        );
    }

    return (

        <DashboardShell
            role="Admin"
            nav={adminNav}
        >

            <div>

                {/* HEADER */}
                <div className="flex flex-wrap items-end justify-between gap-4 mb-10">

                    <div>

                        <div className="text-[11px] tracking-[0.3em] uppercase text-[oklch(0.5_0.012_70)]">
                            Vendor Management
                        </div>

                        <h1 className="mt-3 text-5xl font-bold tracking-tight">
                            Vendors
                        </h1>

                        <p className="mt-3 text-[oklch(0.5_0.012_70)]">
                            Manage suppliers and vendor relationships.
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            navigate("/admin/vendors/add")
                        }
                        className="rounded-full bg-[oklch(0.205_0.012_60)] text-white px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase inline-flex items-center gap-2 hover:opacity-90 transition"
                    >

                        <Plus className="h-4 w-4" />

                        Add Vendor

                    </button>

                </div>

                {/* STATS */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">

                    <StatCard
                        label="Total Vendors"
                        value={`${vendors.length}`}
                    />

                    <StatCard
                        label="Active Suppliers"
                        value={`${vendors.length}`}
                    />

                    <StatCard
                        label="Total Parts Supply"
                        value={`${vendors.reduce(
                            (sum, v) =>
                                sum + (v.totalParts ?? 0),
                            0
                        )}`}
                    />

                </div>

                {/* VENDOR CARDS */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {vendors.length === 0 ? (

                        <DataCard title="No Vendors">

                            <div className="py-10 text-center text-[oklch(0.5_0.012_70)]">
                                No vendors available.
                            </div>

                        </DataCard>

                    ) : (

                        vendors.map((vendor) => (

                            <div
                                key={vendor.vendorId}
                                className="rounded-3xl border border-[oklch(0.88_0.012_80)] bg-white p-6 hover:shadow-lg transition"
                            >

                                {/* TOP */}
                                <div className="flex items-start justify-between gap-4">

                                    <div>

                                        <div className="text-[10px] tracking-[0.25em] uppercase text-[oklch(0.5_0.012_70)]">
                                            Vendor
                                        </div>

                                        <h3 className="mt-2 text-2xl font-bold">
                                            {vendor.vendorName}
                                        </h3>

                                    </div>

                                    <div className="rounded-full bg-[oklch(0.94_0.01_80)] px-3 py-1 text-xs">
                                        {vendor.totalParts ?? 0} Parts
                                    </div>

                                </div>

                                {/* DETAILS */}
                                <div className="mt-6 space-y-4">

                                    <div className="flex items-center gap-3 text-sm text-[oklch(0.45_0.012_70)]">

                                        <Mail className="h-4 w-4" />

                                        <span>
                                            {vendor.email ?? "No email"}
                                        </span>

                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-[oklch(0.45_0.012_70)]">

                                        <Phone className="h-4 w-4" />

                                        <span>
                                            {vendor.phoneNumber ?? "No phone"}
                                        </span>

                                    </div>

                                    <div className="flex items-start gap-3 text-sm text-[oklch(0.45_0.012_70)]">

                                        <MapPin className="h-4 w-4 mt-0.5" />

                                        <span>
                                            {vendor.address ?? "No address"}
                                        </span>

                                    </div>

                                </div>

                                {/* ACTIONS */}
                                <div className="mt-8 flex items-center gap-3">

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/admin/vendors/edit/${vendor.vendorId}`
                                            )
                                        }
                                        className="flex-1 rounded-2xl bg-[oklch(0.205_0.012_60)] text-white py-3 text-sm font-medium hover:opacity-90 transition inline-flex items-center justify-center gap-2"
                                    >

                                        <Pencil className="h-4 w-4" />

                                        Edit

                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                vendor.vendorId
                                            )
                                        }
                                        className="h-12 w-12 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 grid place-items-center transition"
                                    >

                                        <Trash2 className="h-4 w-4" />

                                    </button>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </DashboardShell>
    );
}