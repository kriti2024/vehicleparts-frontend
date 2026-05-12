import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Package,
    Truck,
    Users,
    FileText,
    BarChart3,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import DashboardShell
    from "../../components/Admin/DashboardShell";

import api from "../../api/axios";

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
export default function EditPart() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] =
        useState(true);

    const [partName, setPartName] =
        useState("");

    const [price, setPrice] =
        useState("");

    const [stockQuantity, setStockQuantity] =
        useState("");

    const [vendorId, setVendorId] =
        useState("");

    const [vehicleBrand, setVehicleBrand] =
        useState("");

    const [vehicleModel, setVehicleModel] =
        useState("");

    const [imageFile, setImageFile] =
        useState<File | null>(null);

    useEffect(() => {

        const fetchPart = async () => {

            try {

                const response =
                    await api.get(
                        `/Part/${id}`
                    );

                const part =
                    response.data;

                setPartName(
                    part.partName
                );

                setPrice(
                    part.price.toString()
                );

                setStockQuantity(
                    part.stockQuantity.toString()
                );

                setVendorId(
                    part.vendorId.toString()
                );

                setVehicleBrand(
                    part.vehicleBrand ?? ""
                );

                setVehicleModel(
                    part.vehicleModel ?? ""
                );

            } catch (error) {
                console.error(error);
            }

            finally {
                setLoading(false);
            }
        };

        fetchPart();

    }, [id]);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            const formData =
                new FormData();

            formData.append(
                "partId",
                id ?? ""
            );

            formData.append(
                "partName",
                partName
            );

            formData.append(
                "price",
                price
            );

            formData.append(
                "stockQuantity",
                stockQuantity
            );

            formData.append(
                "vendorId",
                vendorId
            );

            formData.append(
                "vehicleBrand",
                vehicleBrand
            );

            formData.append(
                "vehicleModel",
                vehicleModel
            );

            if (imageFile) {

                formData.append(
                    "imageFile",
                    imageFile
                );
            }

            await api.put(
                `/Part/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            navigate("/admin/parts");

        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {

        return (
            <div className="min-h-screen grid place-items-center">
                Loading part...
            </div>
        );
    }

    return (
        <DashboardShell
            role="Admin"
            nav={adminNav}
        >
            <form
                onSubmit={handleSubmit}
                className="max-w-2xl space-y-6"
            >

                <h1 className="text-4xl font-bold">
                    Edit Part
                </h1>

                <input
                    type="text"
                    placeholder="Part Name"
                    value={partName}
                    onChange={(e) =>
                        setPartName(
                            e.target.value
                        )
                    }
                    className="w-full border p-3 rounded-xl"
                />

                <input
                    type="text"
                    placeholder="Vehicle Brand"
                    value={vehicleBrand}
                    onChange={(e) =>
                        setVehicleBrand(
                            e.target.value
                        )
                    }
                    className="w-full border p-3 rounded-xl"
                />

                <input
                    type="text"
                    placeholder="Vehicle Model"
                    value={vehicleModel}
                    onChange={(e) =>
                        setVehicleModel(
                            e.target.value
                        )
                    }
                    className="w-full border p-3 rounded-xl"
                />

                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) =>
                        setPrice(
                            e.target.value
                        )
                    }
                    className="w-full border p-3 rounded-xl"
                />

                <input
                    type="number"
                    placeholder="Stock Quantity"
                    value={stockQuantity}
                    onChange={(e) =>
                        setStockQuantity(
                            e.target.value
                        )
                    }
                    className="w-full border p-3 rounded-xl"
                />

                <input
                    type="number"
                    placeholder="Vendor Id"
                    value={vendorId}
                    onChange={(e) =>
                        setVendorId(
                            e.target.value
                        )
                    }
                    className="w-full border p-3 rounded-xl"
                />

                <input
                    type="file"
                    onChange={(e) =>
                        setImageFile(
                            e.target.files?.[0]
                            ?? null
                        )
                    }
                />

                <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-black text-white"
                >
                    Update Part
                </button>

            </form>
        </DashboardShell>
    );
}