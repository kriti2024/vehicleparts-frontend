import { useEffect, useState } from "react";
import {
    getReportSummary,
    getLowStockParts,
    getMonthlyRevenue,
    getAdminNotifications,
    type AdminNotification,
    type ReportSummary,
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
    Bell,
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
        to: "/admin/requests",
        label: "Part Requests",
        icon: FileText,
    },
    {
        to: "/admin/reports",
        label: "Reports",
        icon: BarChart3,
    },
];

const emptySummary = {
    dailySales: 0,
    monthlySales: 0,
    yearlySales: 0,
    dailyInvoices: 0,
    monthlyInvoices: 0,
    yearlyInvoices: 0,
};

const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
];

export default function AdminDashboard() {

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
        useState<ReportSummary>(emptySummary);

    const [lowStock, setLowStock] =
        useState<LowStockPart[]>([]);

    const [revenueData, setRevenueData] =
        useState<RevenueData[]>([]);

    const [notifications, setNotifications] =
        useState<AdminNotification[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchDashboard = async () => {
            try {
                setError("");

                const [
                    summaryResult,
                    lowStockResult,
                    monthlyRevenueResult,
                    notificationResult,
                ] = await Promise.allSettled([
                    getReportSummary(),
                    getLowStockParts(),
                    getMonthlyRevenue(),
                    getAdminNotifications(),
                ]);

                setSummary(
                    summaryResult.status === "fulfilled"
                        ? summaryResult.value ?? emptySummary
                        : emptySummary
                );

                setLowStock(
                    lowStockResult.status === "fulfilled"
                        ? lowStockResult.value
                        : []
                );

                setRevenueData(
                    monthlyRevenueResult.status === "fulfilled"
                        ? monthlyRevenueResult.value
                        : months.map((month) => ({ month, sales: 0 }))
                );

                setNotifications(
                    notificationResult.status === "fulfilled"
                        ? notificationResult.value
                        : []
                );

                const failedRequests = [
                    summaryResult,
                    lowStockResult,
                    monthlyRevenueResult,
                    notificationResult,
                ].filter((result) => result.status === "rejected");

                if (failedRequests.length > 0) {
                    setError(
                        "Some live dashboard data could not be loaded. Sign in with the backend admin account and make sure the backend is running."
                    );
                }

            } catch (error) {
                console.error(error);
                setSummary(emptySummary);
                setLowStock([]);
                setRevenueData([]);
                setNotifications([]);
                setError("Dashboard data could not be loaded from the backend.");
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

                    {error && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                {/* STATS */}
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                    <StatCard
                        label="Monthly Sales"
                        value={`Rs. ${summary.monthlySales}`}
                        hint="Current month revenue"
                    />

                    <StatCard
                        label="Yearly Sales"
                        value={`Rs. ${summary.yearlySales}`}
                        hint="Annual revenue"
                    />

                    <StatCard
                        label="Monthly Invoices"
                        value={`${summary.monthlyInvoices}`}
                        hint="Invoices generated"
                    />

                    <StatCard
                        label="Daily Invoices"
                        value={`${summary.dailyInvoices}`}
                        hint="Today's invoices"
                    />

                </div>

                {/* CONTENT */}
                <div className="grid lg:grid-cols-3 gap-6 mt-8">
                    <div className="lg:col-span-2">
                        <DataCard title="Revenue Overview">
                            <div className="h-72">

                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={revenueData}
                                        margin={{
                                            top: 12,
                                            right: 12,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="oklch(0.82 0.012 80)"
                                        />

                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fontSize: 11,
                                                letterSpacing: 2,
                                                fill: "oklch(0.36 0.012 70)",
                                            }}
                                        />

                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            width={64}
                                            tick={{
                                                fontSize: 12,
                                                fill: "oklch(0.45 0.012 70)",
                                            }}
                                            tickFormatter={(value) =>
                                                `Rs. ${Number(value) / 1000}k`
                                            }
                                        />

                                        <Tooltip
                                            cursor={{
                                                fill: "oklch(0.88 0.018 82)",
                                            }}
                                            formatter={(value) => [
                                                `Rs. ${Number(value).toLocaleString()}`,
                                                "Revenue",
                                            ]}
                                        />

                                        <Bar
                                            dataKey="sales"
                                            radius={[10, 10, 0, 0]}
                                            fill="oklch(0.58 0.16 75)"
                                            maxBarSize={42}
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

                <div className="mt-8">
                    <DataCard title="Admin Notifications">
                        <div className="space-y-3">
                            {notifications.length === 0 ? (
                                <div className="text-sm text-[oklch(0.5_0.012_70)]">
                                    No admin notifications.
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.notificationId}
                                        className="flex items-start gap-3 rounded-2xl bg-[oklch(0.94_0.01_80)] p-4"
                                    >
                                        <Bell className="mt-0.5 h-4 w-4 text-[oklch(0.58_0.16_75)]" />
                                        <div>
                                            <div className="text-sm font-medium">
                                                {notification.message}
                                            </div>
                                            <div className="mt-1 text-xs text-[oklch(0.5_0.012_70)]">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </div>
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
