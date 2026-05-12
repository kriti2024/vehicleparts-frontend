import { useEffect, useState } from "react";

import {
    useNavigate,
} from "react-router-dom";

import DashboardShell
    from "../../components/Admin/DashboardShell";

import DataCard
    from "../../components/Admin/DataCard";

import StatCard
    from "../../components/Admin/StatCard";

import api from "../../api/axios";

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
    AlertTriangle,
} from "lucide-react";

// LOCAL IMAGES
import brakePadImg
    from "../../assets/parts/brake-pad.png";

import engineOilImg
    from "../../assets/parts/engine-oil.jpg";

import sparkPlugImg
    from "../../assets/parts/spark-plug.jpg";

import airFilterImg
    from "../../assets/parts/air-filter.svg";

import clutchPlateImg
    from "../../assets/parts/clutch-plate.svg";

import alloyWheelImg
    from "../../assets/parts/alloy-wheel.svg";

import carBatteryImg
    from "../../assets/parts/car-battery.svg";

import radiatorImg
    from "../../assets/parts/radiator.svg";

import headlightImg
    from "../../assets/parts/headlight.svg";

import tireImg
    from "../../assets/parts/tire.svg";

import fuelFilterImg
    from "../../assets/parts/fuel-filter.svg";

import wiperBladeImg
    from "../../assets/parts/wiper-blade.svg";

import shockAbsorberImg
    from "../../assets/parts/shock-absorber.svg";

import alternatorImg
    from "../../assets/parts/alternator.svg";

import timingBeltImg
    from "../../assets/parts/timing-belt.svg";

import defaultImg
    from "../../assets/parts/default.png";

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

type Part = {
    partId: number;
    partName: string;

    price: number;

    stockQuantity: number;

    vendorId: number;

    vendorName?: string;

    imageUrl?: string;

    vehicleBrand?: string;

    vehicleModel?: string;
};

const fallbackParts: Part[] = [
    {
        partId: 1,
        partName: "Brake Pad",
        price: 3200,
        stockQuantity: 18,
        vendorId: 1,
        vendorName: "Axleworks Stock",
        vehicleBrand: "Toyota / Honda",
        vehicleModel: "Sedan and compact SUV",
    },
    {
        partId: 2,
        partName: "Engine Oil",
        price: 1850,
        stockQuantity: 26,
        vendorId: 1,
        vendorName: "Axleworks Stock",
        vehicleBrand: "Multi-brand",
        vehicleModel: "Petrol engines",
    },
    {
        partId: 3,
        partName: "Spark Plug",
        price: 950,
        stockQuantity: 34,
        vendorId: 1,
        vendorName: "Axleworks Stock",
        vehicleBrand: "Nissan / Hyundai",
        vehicleModel: "1.2L to 1.8L engines",
    },
    {
        partId: 4,
        partName: "Air Filter",
        price: 780,
        stockQuantity: 12,
        vendorId: 1,
        vendorName: "Axleworks Stock",
        vehicleBrand: "Universal",
        vehicleModel: "Most passenger vehicles",
    },
    {
        partId: 5,
        partName: "Clutch Plate",
        price: 4200,
        stockQuantity: 9,
        vendorId: 1,
        vendorName: "Axleworks Stock",
        vehicleBrand: "Toyota / Suzuki",
        vehicleModel: "Manual transmission",
    },
    {
        partId: 6,
        partName: "Alloy Wheel",
        price: 8500,
        stockQuantity: 16,
        vendorId: 1,
        vendorName: "Axleworks Stock",
        vehicleBrand: "Universal",
        vehicleModel: "15 to 17 inch fitment",
    },
    {
        partId: 7,
        partName: "Car Battery",
        price: 7600,
        stockQuantity: 14,
        vendorId: 1,
        vendorName: "Axleworks Stock",
        vehicleBrand: "Multi-brand",
        vehicleModel: "12V passenger vehicles",
    },
    {
        partId: 8,
        partName: "Radiator",
        price: 9800,
        stockQuantity: 8,
        vendorId: 1,
        vendorName: "Axleworks Stock",
        vehicleBrand: "Toyota / Nissan",
        vehicleModel: "Sedan and SUV cooling system",
    },
    {
        partId: 9,
        partName: "Headlight",
        price: 5200,
        stockQuantity: 20,
        vendorId: 1,
        vendorName: "Axleworks Stock",
        vehicleBrand: "Hyundai / Suzuki",
        vehicleModel: "Front lighting assembly",
    },
    {
        partId: 10,
        partName: "Tire",
        price: 6900,
        stockQuantity: 24,
        vendorId: 1,
        vendorName: "Axleworks Stock",
        vehicleBrand: "Universal",
        vehicleModel: "Passenger vehicle tire",
    },
    {
        partId: 11,
        partName: "Fuel Filter",
        price: 1450,
        stockQuantity: 17,
        vendorId: 1,
        vendorName: "Axleworks Stock",
        vehicleBrand: "Multi-brand",
        vehicleModel: "Petrol and diesel engines",
    },
    {
        partId: 12,
        partName: "Wiper Blade",
        price: 1200,
        stockQuantity: 30,
        vendorId: 1,
        vendorName: "Axleworks Stock",
        vehicleBrand: "Universal",
        vehicleModel: "Front windshield",
    },
    {
        partId: 13,
        partName: "Shock Absorber",
        price: 6400,
        stockQuantity: 10,
        vendorId: 1,
        vendorName: "Axleworks Stock",
        vehicleBrand: "Toyota / Hyundai",
        vehicleModel: "Suspension system",
    },
    {
        partId: 14,
        partName: "Alternator",
        price: 11800,
        stockQuantity: 7,
        vendorId: 1,
        vendorName: "Axleworks Stock",
        vehicleBrand: "Multi-brand",
        vehicleModel: "Charging system",
    },
    {
        partId: 15,
        partName: "Timing Belt",
        price: 3600,
        stockQuantity: 15,
        vendorId: 1,
        vendorName: "Axleworks Stock",
        vehicleBrand: "Honda / Nissan",
        vehicleModel: "Engine timing system",
    },
];

const getPartKey = (
    partName: string
) => {
    const name =
        partName.toLowerCase();

    if (name.includes("brake"))
        return "brake";

    if (name.includes("oil"))
        return "oil";

    if (name.includes("spark"))
        return "spark";

    if (name.includes("air") && name.includes("filter"))
        return "air-filter";

    if (name.includes("clutch") || name.includes("clucth") || name.includes("plage"))
        return "clutch";

    if (name.includes("alloy") || name.includes("aloy") || name.includes("wheel"))
        return "alloy-wheel";

    if (name.includes("battery"))
        return "battery";

    if (name.includes("radiator"))
        return "radiator";

    if (name.includes("headlight") || name.includes("head light"))
        return "headlight";

    if (name.includes("tire") || name.includes("tyre"))
        return "tire";

    if (name.includes("fuel") && name.includes("filter"))
        return "fuel-filter";

    if (name.includes("wiper"))
        return "wiper";

    if (name.includes("shock") || name.includes("absorber"))
        return "shock-absorber";

    if (name.includes("alternator"))
        return "alternator";

    if (name.includes("timing") && name.includes("belt"))
        return "timing-belt";

    return name.trim();
};

const includeFallbackParts = (
    apiParts: Part[]
) => {
    const existingKeys =
        new Set(
            apiParts.map((part) =>
                getPartKey(part.partName)
            )
        );

    const missingParts =
        fallbackParts.filter((part) =>
            !existingKeys.has(
                getPartKey(part.partName)
            )
        );

    return [
        ...apiParts,
        ...missingParts,
    ];
};

export default function PartsPage() {

    const navigate =
        useNavigate();

    const [parts, setParts] =
        useState<Part[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const fetchParts = async () => {

            try {

                const response =
                    await api.get("/Part");

                setParts(
                    includeFallbackParts(
                        response.data
                    )
                );

            } catch (error) {

                console.error(error);
                setParts(fallbackParts);
            }

            finally {

                setLoading(false);
            }
        };

        fetchParts();

    }, []);

    const handleDelete = async (
        id: number
    ) => {

        const confirmed =
            window.confirm(
                "Delete this part?"
            );

        if (!confirmed)
            return;

        try {

            await api.delete(
                `/Part/${id}`
            );

            setParts((prev) =>
                prev.filter(
                    (p) => p.partId !== id
                )
            );

        } catch (error) {

            console.error(error);
        }
    };

    const getLocalImage = (
        partName: string
    ) => {

        const name =
            partName.toLowerCase();

        if (name.includes("brake"))
            return brakePadImg;

        if (name.includes("oil"))
            return engineOilImg;

        if (name.includes("spark"))
            return sparkPlugImg;

        if (name.includes("air") && name.includes("filter"))
            return airFilterImg;

        if (name.includes("clutch") || name.includes("clucth") || name.includes("plage"))
            return clutchPlateImg;

        if (name.includes("alloy") || name.includes("aloy") || name.includes("wheel"))
            return alloyWheelImg;

        if (name.includes("battery"))
            return carBatteryImg;

        if (name.includes("radiator"))
            return radiatorImg;

        if (name.includes("headlight") || name.includes("head light"))
            return headlightImg;

        if (name.includes("tire") || name.includes("tyre"))
            return tireImg;

        if (name.includes("fuel") && name.includes("filter"))
            return fuelFilterImg;

        if (name.includes("wiper"))
            return wiperBladeImg;

        if (name.includes("shock") || name.includes("absorber"))
            return shockAbsorberImg;

        if (name.includes("alternator"))
            return alternatorImg;

        if (name.includes("timing") && name.includes("belt"))
            return timingBeltImg;

        return defaultImg;
    };

    const totalStock =
        parts.reduce(
            (sum, p) =>
                sum + p.stockQuantity,
            0
        );

    const lowStockCount =
        parts.filter(
            (p) =>
                p.stockQuantity < 10
        ).length;

    const inventoryValue =
        parts.reduce(
            (sum, p) =>
                sum +
                (
                    p.price *
                    p.stockQuantity
                ),
            0
        );

    if (loading) {

        return (
            <div className="min-h-screen grid place-items-center">
                Loading parts...
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
                            Parts Management
                        </div>

                        <h1 className="mt-3 text-5xl font-bold tracking-tight">
                            Parts Inventory
                        </h1>

                        <p className="mt-3 text-[oklch(0.5_0.012_70)]">
                            Manage vehicle parts,
                            stock and inventory.
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            navigate(
                                "/admin/parts/add"
                            )
                        }
                        className="rounded-full bg-[oklch(0.205_0.012_60)] text-white px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase inline-flex items-center gap-2 hover:opacity-90 transition"
                    >

                        <Plus className="h-4 w-4" />

                        Add Part

                    </button>

                </div>

                {/* STATS */}
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

                    <StatCard
                        label="Total Parts"
                        value={`${parts.length}`}
                    />

                    <StatCard
                        label="Stock Quantity"
                        value={`${totalStock}`}
                    />

                    <StatCard
                        label="Low Stock"
                        value={`${lowStockCount}`}
                        hint="Below 10 units"
                    />

                    <StatCard
                        label="Inventory Value"
                        value={`Rs. ${inventoryValue.toFixed(0)}`}
                    />

                </div>

                {/* TABLE */}
                <DataCard title="All Parts">

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead>

                                <tr className="border-b border-[oklch(0.88_0.012_80)] text-left">

                                    <th className="py-4 pr-4">
                                        Image
                                    </th>

                                    <th className="py-4 pr-4">
                                        Part
                                    </th>

                                    <th className="py-4 pr-4">
                                        Vendor
                                    </th>

                                    <th className="py-4 pr-4">
                                        Price
                                    </th>

                                    <th className="py-4 pr-4">
                                        Stock
                                    </th>

                                    <th className="py-4 text-right">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {parts.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan={6}
                                            className="py-10 text-center text-[oklch(0.5_0.012_70)]"
                                        >

                                            No parts available.

                                        </td>

                                    </tr>

                                ) : (

                                    parts.map((part) => (

                                        <tr
                                            key={part.partId}
                                            className="border-b border-[oklch(0.88_0.012_80)]"
                                        >

                                            {/* IMAGE */}
                                            <td className="py-4 pr-4">

                                                <img
                                                    src={
                                                        part.imageUrl
                                                            ? `${import.meta.env.VITE_SERVER_URL}${part.imageUrl}`
                                                            : getLocalImage(
                                                                part.partName
                                                            )
                                                    }
                                                    alt={part.partName}
                                                    onError={(event) => {
                                                        event.currentTarget.src = getLocalImage(
                                                            part.partName
                                                        );
                                                    }}
                                                    className="h-16 w-16 rounded-2xl object-cover border border-[oklch(0.88_0.012_80)]"
                                                />

                                            </td>

                                            {/* NAME */}
                                            <td className="py-4 pr-4">

                                                <div className="space-y-1">

                                                    <div className="font-semibold text-[15px]">
                                                        {part.partName}
                                                    </div>

                                                    <div className="inline-flex items-center rounded-full bg-[oklch(0.94_0.01_80)] px-3 py-1 text-xs text-[oklch(0.45_0.012_70)]">
                                                        {part.vehicleBrand} • {part.vehicleModel}
                                                    </div>

                                                </div>

                                            </td>

                                            {/* VENDOR */}
                                            <td className="py-4 pr-4 text-[oklch(0.5_0.012_70)]">

                                                {part.vendorName
                                                    ?? "Unknown"}

                                            </td>

                                            {/* PRICE */}
                                            <td className="py-4 pr-4">

                                                Rs. {part.price}

                                            </td>

                                            {/* STOCK */}
                                            <td className="py-4 pr-4">

                                                <span
                                                    className={`inline-flex items-center gap-1 ${part.stockQuantity < 10
                                                        ? "text-red-500 font-semibold"
                                                        : ""
                                                        }`}
                                                >

                                                    {part.stockQuantity < 10 && (

                                                        <AlertTriangle className="h-4 w-4" />

                                                    )}

                                                    {part.stockQuantity}

                                                </span>

                                            </td>

                                            {/* ACTIONS */}
                                            <td className="py-4 text-right">

                                                <div className="flex items-center justify-end gap-2">

                                                    {/* EDIT */}
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/parts/edit/${part.partId}`
                                                            )
                                                        }
                                                        className="h-9 w-9 rounded-xl hover:bg-[oklch(0.92_0.014_80)] grid place-items-center transition"
                                                    >

                                                        <Pencil className="h-4 w-4" />

                                                    </button>

                                                    {/* DELETE */}
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                part.partId
                                                            )
                                                        }
                                                        className="h-9 w-9 rounded-xl hover:bg-red-100 text-red-500 grid place-items-center transition"
                                                    >

                                                        <Trash2 className="h-4 w-4" />

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

        </DashboardShell>
    );
}
