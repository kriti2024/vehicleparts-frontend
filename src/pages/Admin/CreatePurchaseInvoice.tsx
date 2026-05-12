import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import DashboardShell
    from "../../components/Admin/DashboardShell";

import DataCard
    from "../../components/Admin/DataCard";

import api from "../../api/axios";

import {
    LayoutDashboard,
    Package,
    Truck,
    Users,
    FileText,
    BarChart3,
    Plus,
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
};

type Part = {
    partId: number;
    partName: string;
};

type InvoiceItem = {
    partId: number;
    quantity: number;
    unitPrice: number;
};

export default function CreatePurchaseInvoice() {

    const navigate =
        useNavigate();

    const [vendors, setVendors] =
        useState<Vendor[]>([]);

    const [parts, setParts] =
        useState<Part[]>([]);

    const [vendorId, setVendorId] =
        useState("");

    const [purchaseDate, setPurchaseDate] =
        useState(
            new Date()
                .toISOString()
                .split("T")[0]
        );

    const [items, setItems] =
        useState<InvoiceItem[]>([
            {
                partId: 0,
                quantity: 1,
                unitPrice: 0,
            },
        ]);

    useEffect(() => {

        const fetchData = async () => {

            try {

                const vendorsRes =
                    await api.get("/Vendor");

                const partsRes =
                    await api.get("/Part");

                setVendors(vendorsRes.data);

                setParts(partsRes.data);

            } catch (error) {

                console.error(error);
            }
        };

        fetchData();

    }, []);

    const handleItemChange = (
        index: number,
        field: keyof InvoiceItem,
        value: string
    ) => {

        const updated =
            [...items];

        updated[index] = {
            ...updated[index],
            [field]: Number(value),
        };

        setItems(updated);
    };

    const addRow = () => {

        setItems([
            ...items,
            {
                partId: 0,
                quantity: 1,
                unitPrice: 0,
            },
        ]);
    };

    const removeRow = (
        index: number
    ) => {

        const updated =
            items.filter(
                (_, i) => i !== index
            );

        setItems(updated);
    };

    const totalAmount =
        items.reduce(
            (sum, item) =>
                sum +
                (
                    item.quantity *
                    item.unitPrice
                ),
            0
        );

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            const payload = {
                vendorId: Number(vendorId),

                purchaseDate:
                    new Date(purchaseDate).toISOString(),

                items: items.filter(
                    (x) => x.partId !== 0
                ),
            };

            await api.post(
                "/Purchase",
                payload
            );

            alert(
                "Purchase invoice created successfully."
            );

            navigate(
                "/admin/invoices"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Failed to create invoice."
            );
        }
    };

    return (

        <DashboardShell
            role="Admin"
            nav={adminNav}
        >

            <div>

                {/* HEADER */}
                <div className="mb-10">

                    <div className="text-[11px] tracking-[0.3em] uppercase text-gray-500">
                        Purchase Management
                    </div>

                    <h1 className="mt-3 text-5xl font-bold">
                        Create Purchase Invoice
                    </h1>

                    <p className="mt-3 text-gray-500">
                        Create vendor purchase invoices and update inventory.
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                >

                    <DataCard title="Invoice Information">

                        <div className="grid md:grid-cols-2 gap-6">

                            {/* Vendor */}
                            <div>

                                <label className="text-sm font-medium">
                                    Vendor
                                </label>

                                <select
                                    required
                                    value={vendorId}
                                    onChange={(e) =>
                                        setVendorId(
                                            e.target.value
                                        )
                                    }
                                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
                                >

                                    <option value="">
                                        Select Vendor
                                    </option>

                                    {vendors.map((v) => (

                                        <option
                                            key={v.vendorId}
                                            value={v.vendorId}
                                        >

                                            {v.vendorName}

                                        </option>

                                    ))}

                                </select>

                            </div>

                            {/* Date */}
                            <div>

                                <label className="text-sm font-medium">
                                    Purchase Date
                                </label>

                                <input
                                    type="date"
                                    value={purchaseDate}
                                    onChange={(e) =>
                                        setPurchaseDate(
                                            e.target.value
                                        )
                                    }
                                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
                                />

                            </div>

                        </div>

                    </DataCard>

                    {/* ITEMS */}
                    <div className="mt-8">

                        <DataCard title="Invoice Items">

                            <div className="space-y-6">

                                {items.map((
                                    item,
                                    index
                                ) => (

                                    <div
                                        key={index}
                                        className="grid md:grid-cols-4 gap-4 items-end border-b pb-6"
                                    >

                                        {/* Part */}
                                        <div>

                                            <label className="text-sm font-medium">
                                                Part
                                            </label>

                                            <select
                                                required
                                                value={item.partId}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        index,
                                                        "partId",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
                                            >

                                                <option value="0">
                                                    Select Part
                                                </option>

                                                {parts.map((p) => (

                                                    <option
                                                        key={p.partId}
                                                        value={p.partId}
                                                    >

                                                        {p.partName}

                                                    </option>

                                                ))}

                                            </select>

                                        </div>

                                        {/* Quantity */}
                                        <div>

                                            <label className="text-sm font-medium">
                                                Quantity
                                            </label>

                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        index,
                                                        "quantity",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
                                            />

                                        </div>

                                        {/* Unit Price */}
                                        <div>

                                            <label className="text-sm font-medium">
                                                Unit Price
                                            </label>

                                            <input
                                                type="number"
                                                min="0"
                                                value={item.unitPrice}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        index,
                                                        "unitPrice",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3"
                                            />

                                        </div>

                                        {/* Remove */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeRow(index)
                                            }
                                            className="h-12 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 inline-flex items-center justify-center"
                                        >

                                            <Trash2 className="h-4 w-4" />

                                        </button>

                                    </div>

                                ))}

                                {/* Add Row */}
                                <button
                                    type="button"
                                    onClick={addRow}
                                    className="rounded-2xl border border-gray-200 px-5 py-3 inline-flex items-center gap-2 hover:bg-gray-50"
                                >

                                    <Plus className="h-4 w-4" />

                                    Add Item

                                </button>

                            </div>

                        </DataCard>

                    </div>

                    {/* TOTAL */}
                    <div className="mt-8 flex items-center justify-between rounded-3xl border border-gray-200 bg-white p-6">

                        <div>

                            <div className="text-sm text-gray-500">
                                Total Purchase Amount
                            </div>

                            <div className="text-3xl font-bold mt-1">
                                Rs. {totalAmount.toFixed(2)}
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="rounded-2xl bg-black text-white px-8 py-4 text-sm font-medium hover:opacity-90"
                        >

                            Create Invoice

                        </button>

                    </div>

                </form>

            </div>

        </DashboardShell>
    );
}