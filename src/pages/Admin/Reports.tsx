import { useEffect, useState } from "react";
import DashboardShell from "../../components/Admin/DashboardShell";
import DataCard from "../../components/Admin/DataCard";
import StatCard from "../../components/Admin/StatCard";
import {
    getReportSummary,
    getDailyReport,
    getMonthlyReport,
    getYearlyReport,
    sendCreditReminders,
    sendLowStockAlerts,
} from "../../api/admin";
import {
    LayoutDashboard,
    Package,
    Truck,
    Users,
    FileText,
    BarChart3,
    Download,
} from "lucide-react";

const adminNav = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/parts", label: "Parts", icon: Package },
    { to: "/admin/vendors", label: "Vendors", icon: Truck },
    { to: "/admin/staff", label: "Staff", icon: Users },
    { to: "/admin/customers", label: "Customers", icon: Users },
    { to: "/admin/invoices", label: "Invoices", icon: FileText },
    { to: "/admin/reports", label: "Reports", icon: BarChart3 },
];

type ReportData = {
    sales: number;
    invoices: number;
};

type Summary = {
    dailySales: number;
    monthlySales: number;
    yearlySales: number;
    dailyInvoices: number;
    monthlyInvoices: number;
    yearlyInvoices: number;
};

export default function ReportsPage() {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [report, setReport] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<"daily" | "monthly" | "yearly">("monthly");

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const summaryData = await getReportSummary();
                setSummary(summaryData);

                const monthlyData = await getMonthlyReport();
                setReport(monthlyData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handlePeriodChange = async (value: "daily" | "monthly" | "yearly") => {
        setPeriod(value);
        try {
            if (value === "daily") {
                setReport(await getDailyReport());
            } else if (value === "monthly") {
                setReport(await getMonthlyReport());
            } else {
                setReport(await getYearlyReport());
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendCreditReminders = async () => {
        try {
            const res = await sendCreditReminders();
            alert(res.message);
        } catch (error) {
            console.error(error);
            alert("Failed to send reminders.");
        }
    };

    const handleSendLowStockAlerts = async () => {
        try {
            const res = await sendLowStockAlerts();
            alert(res.message);
        } catch (error) {
            console.error(error);
            alert("Failed to send alerts.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center">
                Loading reports...
            </div>
        );
    }

    return (
        <DashboardShell role="Admin" nav={adminNav}>
            <div>

                {/* HEADER */}
                <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
                    <div>
                        <div className="text-[11px] uppercase tracking-[0.3em] text-gray-500">
                            Analytics & Reports
                        </div>
                        <h1 className="mt-3 text-5xl font-bold">Financial Reports</h1>
                        <p className="mt-3 text-gray-500">
                            Auto-generated business insights and reports.
                        </p>
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="rounded-full bg-black text-white px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase inline-flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export PDF
                    </button>
                </div>

                {/* PERIOD FILTER */}
                <div className="inline-flex p-1 bg-gray-100 rounded-2xl mb-8">
                    {(["daily", "monthly", "yearly"] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => handlePeriodChange(p)}
                            className={`px-5 py-2 rounded-xl text-xs uppercase tracking-[0.2em] transition ${period === p
                                    ? "bg-white shadow font-semibold"
                                    : "text-gray-500"
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                {/* STAT CARDS */}
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <StatCard label="Revenue" value={`Rs. ${report?.sales ?? 0}`} />
                    <StatCard label="Invoices" value={`${report?.invoices ?? 0}`} />
                    <StatCard label="Monthly Sales" value={`Rs. ${summary?.monthlySales ?? 0}`} />
                    <StatCard label="Yearly Sales" value={`Rs. ${summary?.yearlySales ?? 0}`} />
                </div>

                {/* SYSTEM NOTIFICATIONS */}
                <div className="mb-8">
                    <DataCard title="System Notifications">
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleSendLowStockAlerts}
                                className="rounded-2xl bg-red-500 text-white px-6 py-3 text-sm font-medium hover:opacity-90"
                            >
                                Send Low Stock Alerts
                            </button>
                            <button
                                onClick={handleSendCreditReminders}
                                className="rounded-2xl bg-yellow-500 text-white px-6 py-3 text-sm font-medium hover:opacity-90"
                            >
                                Send Credit Reminders
                            </button>
                        </div>
                    </DataCard>
                </div>

                {/* FINANCIAL SUMMARY */}
                <DataCard title="Financial Summary">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="rounded-2xl bg-gray-50 p-6">
                            <div className="text-sm text-gray-500">Daily Revenue</div>
                            <div className="mt-2 text-3xl font-bold">
                                Rs. {summary?.dailySales ?? 0}
                            </div>
                        </div>
                        <div className="rounded-2xl bg-gray-50 p-6">
                            <div className="text-sm text-gray-500">Monthly Revenue</div>
                            <div className="mt-2 text-3xl font-bold">
                                Rs. {summary?.monthlySales ?? 0}
                            </div>
                        </div>
                        <div className="rounded-2xl bg-gray-50 p-6">
                            <div className="text-sm text-gray-500">Yearly Revenue</div>
                            <div className="mt-2 text-3xl font-bold">
                                Rs. {summary?.yearlySales ?? 0}
                            </div>
                        </div>
                    </div>
                </DataCard>

            </div>
        </DashboardShell>
    );
}
