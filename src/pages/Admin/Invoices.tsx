import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardShell
    from "../../components/Admin/DashboardShell";

import DataCard
    from "../../components/Admin/DataCard";

import StatCard
    from "../../components/Admin/StatCard";

import {
    getAllPurchaseInvoices,
} from "../../api/admin";

import {
    LayoutDashboard,
    Package,
    Truck,
    Users,
    FileText,
    BarChart3,
    Plus,
    Download,
    Eye,
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

type InvoiceItem = {
    purchaseInvoiceItemId: number;
    partName?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
};

type Invoice = {
    purchaseInvoiceId: number;
    vendorName?: string;
    purchaseDate: string;
    totalAmount: number;
    items?: InvoiceItem[];
};

export default function InvoicesPage() {

    const navigate = useNavigate();

    const [invoices, setInvoices] =
        useState<Invoice[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [selectedInvoice, setSelectedInvoice] =
        useState<Invoice | null>(null);

    useEffect(() => {

        const fetchInvoices = async () => {

            try {

                const data =
                    await getAllPurchaseInvoices();

                setInvoices(data);

            } catch (error) {

                console.error(error);
            }

            finally {

                setLoading(false);
            }
        };

        fetchInvoices();

    }, []);

    if (loading) {

        return (
            <div className="min-h-screen grid place-items-center">
                Loading invoices...
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
                            Purchase Invoice Management
                        </div>

                        <h1 className="mt-3 text-5xl font-bold tracking-tight">
                            Purchase Invoices
                        </h1>

                        <p className="mt-3 text-[oklch(0.5_0.012_70)]">
                            Manage vendor purchases and payment records.
                        </p>

                    </div>
                    <button
                        onClick={() =>
                            navigate(
                                "/admin/invoices/create"
                            )
                        }
                        className="rounded-full bg-[oklch(0.205_0.012_60)] text-white px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase inline-flex items-center gap-2 hover:opacity-90 transition"
                    >

                        <Plus className="h-4 w-4" />

                        New Invoice

                    </button>

                </div>

                {/* STATS */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">

                    <StatCard
                        label="Total Invoices"
                        value={`${invoices.length}`}
                    />

                    <StatCard
                        label="Total Vendors"
                        value={`${new Set(
                            invoices.map(i => i.vendorName)
                        ).size}`}
                    />

                    <StatCard
                        label="Total Purchase Amount"
                        value={`Rs. ${invoices
                            .reduce(
                                (sum, i) => sum + i.totalAmount,
                                0
                            )
                            .toFixed(0)}`}
                    />

                </div>

                {/* TABLE */}
                <DataCard title="Recent Purchase Invoices">

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead>

                                <tr className="border-b border-[oklch(0.88_0.012_80)] text-left">

                                    <th className="py-4 pr-4">
                                        Invoice #
                                    </th>

                                    <th className="py-4 pr-4">
                                        Vendor
                                    </th>

                                    <th className="py-4 pr-4">
                                        Date
                                    </th>

                                    <th className="py-4 pr-4">
                                        Amount
                                    </th>
                                    <th className="py-4 pr-4">
                                        Items
                                    </th>

                                    <th className="py-4 text-right">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {invoices.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan={6}
                                            className="py-10 text-center text-[oklch(0.5_0.012_70)]"
                                        >

                                            No invoices available.

                                        </td>

                                    </tr>

                                ) : (

                                    invoices.map((invoice) => (

                                        <tr
                                            key={invoice.purchaseInvoiceId}
                                            className="border-b border-[oklch(0.88_0.012_80)]"
                                        >

                                            {/* INVOICE ID */}
                                            <td className="py-4 pr-4 font-medium">

                                                PI-{invoice.purchaseInvoiceId}

                                            </td>

                                            {/* VENDOR */}
                                            <td className="py-4 pr-4">

                                                {invoice.vendorName ?? "Vendor"}

                                            </td>

                                            {/* DATE */}
                                            <td className="py-4 pr-4 text-[oklch(0.5_0.012_70)]">

                                                {
                                                    new Date(
                                                        invoice.purchaseDate
                                                    ).toLocaleDateString()
                                                }

                                            </td>

                                            {/* AMOUNT */}
                                            <td className="py-4 pr-4 font-semibold">

                                                Rs. {invoice.totalAmount}

                                            </td>

                                            {/* STATUS */}
                                            <td className="py-4 pr-4">

                                                {invoice.items?.length ?? 0} Items

                                            </td>

                                            {/* ACTIONS */}
                                            <td className="py-4 text-right">

                                                <div className="flex items-center justify-end gap-2">

                                                    {/* VIEW */}
                                                    <button
                                                        onClick={() =>
                                                            setSelectedInvoice(invoice)
                                                        }
                                                        className="h-10 w-10 rounded-xl hover:bg-[oklch(0.92_0.014_80)] grid place-items-center transition"
                                                    >

                                                        <Eye className="h-4 w-4" />

                                                    </button>

                                                    {/* DOWNLOAD */}
                                                    <button
                                                        onClick={() =>
                                                            window.print()
                                                        }
                                                        className="h-10 w-10 rounded-xl hover:bg-[oklch(0.92_0.014_80)] grid place-items-center transition"
                                                    >

                                                        <Download className="h-4 w-4" />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </DataCard>

            </div>
            {selectedInvoice && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-3xl p-8 w-full max-w-2xl">

                        <div className="flex items-center justify-between mb-6">

                            <h2 className="text-2xl font-bold">
                                Purchase Invoice
                            </h2>

                            <button
                                onClick={() =>
                                    setSelectedInvoice(null)
                                }
                                className="text-gray-500"
                            >
                                ✕
                            </button>

                        </div>

                        <div className="space-y-3">

                            <div>
                                <strong>Invoice ID:</strong>
                                {" "}
                                PI-{selectedInvoice.purchaseInvoiceId}
                            </div>

                            <div>
                                <strong>Vendor:</strong>
                                {" "}
                                {selectedInvoice.vendorName}
                            </div>

                            <div>
                                <strong>Date:</strong>
                                {" "}
                                {
                                    new Date(
                                        selectedInvoice.purchaseDate
                                    ).toLocaleDateString()
                                }
                            </div>

                            <div>
                                <strong>Total:</strong>
                                {" "}
                                Rs. {selectedInvoice.totalAmount}
                            </div>

                            <div className="pt-4">

                                <h3 className="font-semibold mb-3">
                                    Items
                                </h3>

                                <div className="space-y-3">

                                    {selectedInvoice.items?.map((item) => (

                                        <div
                                            key={item.purchaseInvoiceItemId}
                                            className="flex items-center justify-between border rounded-xl p-3"
                                        >

                                            <div>

                                                <div className="font-medium">
                                                    {item.partName}
                                                </div>

                                                <div className="text-sm text-gray-500">
                                                    Qty: {item.quantity}
                                                </div>

                                            </div>

                                            <div className="font-semibold">
                                                Rs. {item.totalPrice}
                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </DashboardShell>
    );
}