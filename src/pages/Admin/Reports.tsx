import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../../components/Admin/DashboardShell";
import DataCard from "../../components/Admin/DataCard";
import StatCard from "../../components/Admin/StatCard";
import {
    getFinancialReport,
    type FinancialPurchaseInvoice,
    type FinancialReportPeriod,
    type FinancialSaleInvoice,
    type SimpleFinancialReport,
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

const periods: FinancialReportPeriod[] = ["daily", "monthly", "yearly"];

const formatCurrency = (value: number) =>
    `Rs. ${Number(value || 0).toLocaleString("en-NP", {
        maximumFractionDigits: 2,
    })}`;

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-NP", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });

function EmptyTable({ text }: { text: string }) {
    return (
        <div className="rounded-2xl bg-gray-50 p-6 text-sm text-gray-500">
            {text}
        </div>
    );
}

function SalesInvoiceTable({
    invoices,
}: {
    invoices: FinancialSaleInvoice[];
}) {
    if (invoices.length === 0) {
        return <EmptyTable text="No sales invoices found for this period." />;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase tracking-[0.18em] text-gray-500">
                        <th className="py-3 pr-4 font-semibold">Invoice</th>
                        <th className="py-3 pr-4 font-semibold">Date</th>
                        <th className="py-3 pr-4 font-semibold">Customer</th>
                        <th className="py-3 pr-4 font-semibold">Status</th>
                        <th className="py-3 text-right font-semibold">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr
                            key={invoice.saleId}
                            className="border-b border-gray-100 last:border-0"
                        >
                            <td className="py-4 pr-4 font-semibold">
                                {invoice.invoiceNumber}
                            </td>
                            <td className="py-4 pr-4 text-gray-600">
                                {formatDate(invoice.saleDate)}
                            </td>
                            <td className="py-4 pr-4 text-gray-700">
                                {invoice.customerName}
                            </td>
                            <td className="py-4 pr-4 text-gray-600">
                                {invoice.paymentStatus}
                            </td>
                            <td className="py-4 text-right font-semibold">
                                {formatCurrency(invoice.finalAmount)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function PurchaseInvoiceTable({
    invoices,
}: {
    invoices: FinancialPurchaseInvoice[];
}) {
    if (invoices.length === 0) {
        return <EmptyTable text="No purchase invoices found for this period." />;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase tracking-[0.18em] text-gray-500">
                        <th className="py-3 pr-4 font-semibold">Invoice</th>
                        <th className="py-3 pr-4 font-semibold">Date</th>
                        <th className="py-3 pr-4 font-semibold">Vendor</th>
                        <th className="py-3 text-right font-semibold">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr
                            key={invoice.purchaseInvoiceId}
                            className="border-b border-gray-100 last:border-0"
                        >
                            <td className="py-4 pr-4 font-semibold">
                                {invoice.invoiceNumber}
                            </td>
                            <td className="py-4 pr-4 text-gray-600">
                                {formatDate(invoice.purchaseDate)}
                            </td>
                            <td className="py-4 pr-4 text-gray-700">
                                {invoice.vendorName}
                            </td>
                            <td className="py-4 text-right font-semibold">
                                {formatCurrency(invoice.totalAmount)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function ReportsPage() {
    const [report, setReport] = useState<SimpleFinancialReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [period, setPeriod] = useState<FinancialReportPeriod>("monthly");

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                setError("");
                setReport(await getFinancialReport(period));
            } catch {
                setReport(null);
                setError("Financial report could not be loaded.");
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [period]);

    const totalInvoices = useMemo(
        () =>
            (report?.salesInvoiceCount ?? 0) +
            (report?.purchaseInvoiceCount ?? 0),
        [report]
    );

    const profitHint =
        (report?.estimatedProfit ?? 0) >= 0
            ? "Revenue minus purchase cost"
            : "Purchase cost is higher than sales";

    return (
        <DashboardShell role="Admin" nav={adminNav}>
            <div>
                <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <div className="text-[11px] uppercase tracking-[0.3em] text-gray-500">
                            Analytics & Reports
                        </div>
                        <h1 className="mt-3 text-5xl font-bold">Financial Reports</h1>
                        <p className="mt-3 text-gray-500">
                            {report?.periodLabel ?? "Daily, monthly and yearly report"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white print:hidden"
                    >
                        <Download className="h-4 w-4" />
                        Export PDF
                    </button>
                </div>

                <div className="mb-8 inline-flex rounded-2xl bg-gray-100 p-1 print:hidden">
                    {periods.map((p) => (
                        <button
                            type="button"
                            key={p}
                            disabled={loading}
                            onClick={() => setPeriod(p)}
                            className={`rounded-xl px-5 py-2 text-xs uppercase tracking-[0.2em] transition ${period === p
                                    ? "bg-white shadow font-semibold"
                                    : "text-gray-500"
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        label="Sales"
                        value={loading ? "..." : formatCurrency(report?.totalSalesRevenue ?? 0)}
                        hint="Customer sales revenue"
                    />
                    <StatCard
                        label="Purchases"
                        value={loading ? "..." : formatCurrency(report?.totalPurchaseCost ?? 0)}
                        hint="Vendor purchase cost"
                    />
                    <StatCard
                        label="Profit"
                        value={loading ? "..." : formatCurrency(report?.estimatedProfit ?? 0)}
                        hint={profitHint}
                    />
                    <StatCard
                        label="Invoices"
                        value={loading ? "..." : `${totalInvoices}`}
                        hint={`${report?.salesInvoiceCount ?? 0} sales, ${report?.purchaseInvoiceCount ?? 0} purchase`}
                    />
                </div>

                <div className="space-y-8">
                    <DataCard title="Report Summary">
                        {loading ? (
                            <p className="text-sm text-gray-500">Loading report...</p>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <div className="rounded-2xl bg-gray-50 p-5">
                                    <div className="text-xs uppercase tracking-[0.18em] text-gray-500">
                                        Period
                                    </div>
                                    <div className="mt-2 font-semibold">
                                        {report?.periodLabel ?? "-"}
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-gray-50 p-5">
                                    <div className="text-xs uppercase tracking-[0.18em] text-gray-500">
                                        Discount Given
                                    </div>
                                    <div className="mt-2 font-semibold">
                                        {formatCurrency(report?.totalDiscountGiven ?? 0)}
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-gray-50 p-5">
                                    <div className="text-xs uppercase tracking-[0.18em] text-gray-500">
                                        Sales Invoices
                                    </div>
                                    <div className="mt-2 font-semibold">
                                        {report?.salesInvoiceCount ?? 0}
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-gray-50 p-5">
                                    <div className="text-xs uppercase tracking-[0.18em] text-gray-500">
                                        Purchase Invoices
                                    </div>
                                    <div className="mt-2 font-semibold">
                                        {report?.purchaseInvoiceCount ?? 0}
                                    </div>
                                </div>
                            </div>
                        )}
                    </DataCard>

                    <DataCard title="Recent Sales Invoices">
                        {loading ? (
                            <p className="text-sm text-gray-500">Loading sales invoices...</p>
                        ) : (
                            <SalesInvoiceTable
                                invoices={report?.recentSalesInvoices ?? []}
                            />
                        )}
                    </DataCard>

                    <DataCard title="Recent Purchase Invoices">
                        {loading ? (
                            <p className="text-sm text-gray-500">Loading purchase invoices...</p>
                        ) : (
                            <PurchaseInvoiceTable
                                invoices={report?.recentPurchaseInvoices ?? []}
                            />
                        )}
                    </DataCard>
                </div>

            </div>
        </DashboardShell>
    );
}
