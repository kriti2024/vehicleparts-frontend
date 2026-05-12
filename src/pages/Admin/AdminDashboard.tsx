import { useEffect, useState } from "react";
import {
    getReportSummary,
    getLowStockParts,
    getMonthlyReport
} from "../../api/admin";
import DashboardShell from "../../components/Admin/DashboardShell";
import StatCard from "../../components/Admin/StatCard";
import DataCard from "../../components/Admin/DataCard";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

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

export default function AdminDashboard() {

    type Summary = {
        monthlySales: number;
        yearlySales: number;
        monthlyInvoices: number;
        dailyInvoices: number;
    };

    type LowStockPart = {
        partId: number;
        partName: string;
        stockQuantity: number;
    };

    type RevenueData = {
        month: string;
        sales: number;
    };

    const [summary, setSummary] =
        useState<Summary | null>(null);

    const [lowStock, setLowStock] =
        useState<LowStockPart[]>([]);

    const [revenueData, setRevenueData] =
        useState<RevenueData[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchDashboard = async () => {
            try {

                // Summary data
                const summaryData =
                    await getReportSummary();

                setSummary(summaryData);

                // Low stock data
                const lowStockData =
                    await getLowStockParts();

                setLowStock(lowStockData);

                // Revenue chart data
                const monthlyReport =
                    await getMonthlyReport();

                const formattedRevenue: RevenueData[] = [
                    {
                        month: "Sales",
                        sales: monthlyReport.sales,
                    },
                    {
                        month: "Invoices",
                        sales: monthlyReport.invoices,
                    },
                ];

                setRevenueData(formattedRevenue);

            } catch (error) {
                console.error(error);
            }

            finally {
                setLoading(false);
            }
        };

        fetchDashboard();

    }, []);

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center">
                Loading dashboard...
            </div>
        );
    }

    return (
        <DashboardShell role="Admin" nav={adminNav}>
            <div>
                <div className="mb-10">
                    <div className="text-[11px] tracking-[0.3em] uppercase text-[oklch(0.5_0.012_70)]">
                        Admin Workspace
                    </div>

                    <h1 className="mt-3 text-5xl font-bold tracking-tight text-[oklch(0.205_0.012_60)]">
                        Dashboard Overview
                    </h1>

                    <p className="mt-3 text-[oklch(0.5_0.012_70)]">
                        Monitor inventory, invoices, vendors and financial performance.
                    </p>
                </div>

                {/* STATS */}
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                    <StatCard
                        label="Monthly Sales"
                        value={`Rs. ${summary?.monthlySales ?? 0}`}
                        hint="Current month revenue"
                    />

                    <StatCard
                        label="Yearly Sales"
                        value={`Rs. ${summary?.yearlySales ?? 0}`}
                        hint="Annual revenue"
                    />

                    <StatCard
                        label="Monthly Invoices"
                        value={`${summary?.monthlyInvoices ?? 0}`}
                        hint="Invoices generated"
                    />

                    <StatCard
                        label="Daily Invoices"
                        value={`${summary?.dailyInvoices ?? 0}`}
                        hint="Today's invoices"
                    />

                </div>

                {/* CONTENT */}
                <div className="grid lg:grid-cols-3 gap-6 mt-8">
                    <div className="lg:col-span-2">
                        <DataCard title="Revenue Overview">
                            <div className="h-72">

                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData}>

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />

                                        <XAxis dataKey="month" />

                                        <YAxis />

                                        <Tooltip />

                                        <Bar
                                            dataKey="sales"
                                            radius={[10, 10, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>

                            </div>
                        </DataCard>
                    </div>

                    <DataCard title="Low Stock Alerts">
                        <div className="space-y-4">
                            {lowStock.length === 0 ? (

                                <div className="text-sm text-[oklch(0.5_0.012_70)]">
                                    No low stock alerts.
                                </div>

                            ) : (

                                lowStock.map((item) => (

                                    <div
                                        key={item.partId}
                                        className="rounded-2xl bg-[oklch(0.92_0.014_80)] p-4"
                                    >
                                        <div className="font-medium">
                                            {item.partName}
                                        </div>

                                        <div className="text-sm text-[oklch(0.5_0.012_70)] mt-1">
                                            Only {item.stockQuantity} units remaining
                                        </div>
                                    </div>

                                ))

                            )}
                        </div>
                    </DataCard>
                </div>
            </div>
        </DashboardShell>
    );
}