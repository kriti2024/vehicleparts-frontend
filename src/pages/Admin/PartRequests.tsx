import { useEffect, useState } from "react";
import DashboardShell from "../../components/Admin/DashboardShell";
import DataCard from "../../components/Admin/DataCard";
import StatCard from "../../components/Admin/StatCard";
import { getAllPartRequests, updatePartRequestStatus } from "../../api/admin";
import { LayoutDashboard, Package, Truck, Users, FileText, BarChart3 } from "lucide-react";

const adminNav = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/parts", label: "Parts", icon: Package },
    { to: "/admin/vendors", label: "Vendors", icon: Truck },
    { to: "/admin/staff", label: "Staff", icon: Users },
    { to: "/admin/customers", label: "Customers", icon: Users },
    { to: "/admin/invoices", label: "Invoices", icon: FileText },
    { to: "/admin/requests", label: "Part Requests", icon: FileText },
    { to: "/admin/reports", label: "Reports", icon: BarChart3 },
];

type PartRequest = {
    partRequestId: number;
    customerId: number;
    customerName: string;
    partName: string;
    vehicleModel: string;
    details: string;
    status: string;
    requestedAt: string;
};

export default function PartRequests() {
    const [requests, setRequests] = useState<PartRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const data = await getAllPartRequests();
            setRequests(data);
        } catch (error) {
            console.error("Failed to fetch part requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadRequests = async () => {
            try {
                const data = await getAllPartRequests();
                setRequests(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadRequests();
    }, []);



    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            await updatePartRequestStatus(id, newStatus);
            fetchRequests(); // Refresh data
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center">
                Loading part requests...
            </div>
        );
    }

    const openCount = requests.filter(r => r.status === "Open" || r.status === "Requested").length;
    const sourcingCount = requests.filter(r => r.status === "Sourcing").length;
    const arrivedCount = requests.filter(r => r.status === "Arrived").length;

    return (
        <DashboardShell role="Admin" nav={adminNav}>
            <div>
                <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
                    <div>
                        <div className="text-[11px] tracking-[0.3em] uppercase text-[oklch(0.5_0.012_70)]">
                            Customer Requests
                        </div>
                        <h1 className="mt-3 text-5xl font-bold tracking-tight">
                            Part Requests
                        </h1>
                        <p className="mt-3 text-[oklch(0.5_0.012_70)]">
                            Manage and fulfill special parts requested by customers.
                        </p>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <StatCard label="Open Requests" value={`${openCount}`} />
                    <StatCard label="In Sourcing" value={`${sourcingCount}`} />
                    <StatCard label="Arrived" value={`${arrivedCount}`} />
                </div>

                {/* TABLE */}
                <DataCard title="Request Queue">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[oklch(0.88_0.012_80)] text-left">
                                    <th className="py-4 pr-4">ID</th>
                                    <th className="py-4 pr-4">Customer</th>
                                    <th className="py-4 pr-4">Part / Model</th>
                                    <th className="py-4 pr-4">Details</th>
                                    <th className="py-4 pr-4">Date</th>
                                    <th className="py-4 pr-4">Status</th>
                                    <th className="py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center text-[oklch(0.5_0.012_70)]">
                                            No part requests found.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((req) => (
                                        <tr key={req.partRequestId} className="border-b border-[oklch(0.88_0.012_80)]">
                                            <td className="py-4 pr-4">#{req.partRequestId}</td>
                                            <td className="py-4 pr-4 font-semibold">{req.customerName || "Customer"}</td>
                                            <td className="py-4 pr-4">
                                                <div className="font-semibold text-[15px]">{req.partName}</div>
                                                <div className="text-xs text-[oklch(0.5_0.012_70)]">{req.vehicleModel}</div>
                                            </td>
                                            <td className="py-4 pr-4 text-[oklch(0.5_0.012_70)] max-w-xs truncate">
                                                {req.details || "-"}
                                            </td>
                                            <td className="py-4 pr-4">
                                                {new Date(req.requestedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                            </td>
                                            <td className="py-4 pr-4">
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                                    req.status === 'Arrived' ? 'bg-green-100 text-green-700' : 
                                                    req.status === 'Sourcing' ? 'bg-blue-100 text-blue-700' : 
                                                    'bg-orange-100 text-orange-700'
                                                }`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <select
                                                    value={req.status}
                                                    onChange={(e) => handleStatusUpdate(req.partRequestId, e.target.value)}
                                                    className="px-3 py-2 bg-white border border-[oklch(0.88_0.01_80)] rounded-xl text-sm outline-none w-32 focus:ring-1 focus:ring-black"
                                                >
                                                    <option value="Open">Open</option>
                                                    <option value="Requested">Requested</option>
                                                    <option value="Sourcing">Sourcing</option>
                                                    <option value="Arrived">Arrived</option>
                                                </select>
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
