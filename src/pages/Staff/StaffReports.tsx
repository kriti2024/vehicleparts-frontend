import { useEffect, useMemo, useState } from "react";
import {
    CreditCard,
    Download,
    Star,
    Users,
} from "lucide-react";

import {
    DataCard,
    EmptyState,
    InlineAlert,
    PageHeader,
    PrimaryButton,
    SelectField,
    StatCard,
    TableHead,
    TableShell,
    Td,
    Th,
} from "../../components/staff/DashboardParts";

import { getCustomerReports } from "../../api/reportApi";

import type {
    CustomerReport,
    CustomerSummary,
} from "../../types/report";

function CustomerTable({
    customers,
}: {
    customers: CustomerSummary[];
}) {
    if (customers.length === 0) {
        return (
            <EmptyState
                title="No records found"
                text="No customer report data available."
            />
        );
    }

    return (
        <TableShell>
            <TableHead>
                <Th>Customer</Th>
                <Th>Phone</Th>
                <Th>Purchases</Th>
                <Th>Spent</Th>
                <Th>Pending</Th>
            </TableHead>

            <tbody>
                {customers.map((customer) => (
                    <tr key={customer.customerId}>
                        <Td>
                            <div className="font-semibold">
                                {customer.fullName}
                            </div>

                            <div className="text-xs text-gray-500">
                                {customer.email || "-"}
                            </div>
                        </Td>

                        <Td>{customer.phone}</Td>

                        <Td>{customer.totalPurchases}</Td>

                        <Td>
                            Rs. {customer.totalSpent}
                        </Td>

                        <Td>
                            Rs. {customer.pendingAmount}
                        </Td>
                    </tr>
                ))}
            </tbody>
        </TableShell>
    );
}

export default function StaffReports() {
    const [report, setReport] =
        useState<CustomerReport | null>(null);

    const [reportView, setReportView] =
        useState("all");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const loadReports = async () => {
            try {
                setLoading(true);

                const data =
                    await getCustomerReports();

                setReport(data);
            } catch {
                setError(
                    "Failed to load customer reports."
                );
            } finally {
                setLoading(false);
            }
        };

        loadReports();
    }, []);

    const summary = useMemo(() => {
        return {
            regular:
                report?.regularCustomers.length || 0,

            high:
                report?.highSpenders.length || 0,

            pending:
                report?.pendingCreditCustomers.length || 0,
        };
    }, [report]);

    const handleExport = () => {
        if (!report) return;

        const rows = [
            [
                "Type",
                "Customer",
                "Phone",
                "Email",
                "Purchases",
                "Spent",
                "Pending",
            ],

            ...report.highSpenders.map((c) => [
                "High Spender",
                c.fullName,
                c.phone,
                c.email,
                c.totalPurchases,
                c.totalSpent,
                c.pendingAmount,
            ]),

            ...report.regularCustomers.map((c) => [
                "Regular Customer",
                c.fullName,
                c.phone,
                c.email,
                c.totalPurchases,
                c.totalSpent,
                c.pendingAmount,
            ]),

            ...report.pendingCreditCustomers.map((c) => [
                "Pending Credit",
                c.fullName,
                c.phone,
                c.email,
                c.totalPurchases,
                c.totalSpent,
                c.pendingAmount,
            ]),
        ];

        const csv = rows
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob(
            [csv],
            { type: "text/csv;charset=utf-8" }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download =
            "customer-reports.csv";

        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <>
            <PageHeader
                eyebrow="Staff Reports"
                title="Customer Reports"
                subtitle="View high spenders, regular customers, and pending credit customers."
                action={
                    <PrimaryButton
                        type="button"
                        icon={Download}
                        variant="outline"
                        disabled={!report}
                        onClick={handleExport}
                    >
                        Export CSV
                    </PrimaryButton>
                }
            />

            {error && (
                <InlineAlert>
                    {error}
                </InlineAlert>
            )}

            <div className="mb-6 grid md:grid-cols-3 gap-5">
                <StatCard
                    icon={Users}
                    label="Regular Customers"
                    value={
                        loading ? "..." : summary.regular
                    }
                />

                <StatCard
                    icon={Star}
                    label="High Spenders"
                    value={
                        loading ? "..." : summary.high
                    }
                    tone="amber"
                />

                <StatCard
                    icon={CreditCard}
                    label="Pending Credits"
                    value={
                        loading ? "..." : summary.pending
                    }
                    tone="dark"
                />
            </div>

            <DataCard
                className="mb-6"
                title="Report Filter"
            >
                <SelectField
                    label="View"
                    value={reportView}
                    onChange={setReportView}
                    options={[
                        {
                            value: "all",
                            label: "All Reports",
                        },
                        {
                            value: "high",
                            label: "High Spenders",
                        },
                        {
                            value: "regular",
                            label: "Regular Customers",
                        },
                        {
                            value: "pending",
                            label: "Pending Credits",
                        },
                    ]}
                />
            </DataCard>

            <div className="space-y-6">
                {(reportView === "all" ||
                    reportView === "high") && (
                        <DataCard title="High Spenders">
                            {loading || !report ? (
                                <p>Loading...</p>
                            ) : (
                                <CustomerTable
                                    customers={
                                        report.highSpenders
                                    }
                                />
                            )}
                        </DataCard>
                    )}

                {(reportView === "all" ||
                    reportView === "regular") && (
                        <DataCard title="Regular Customers">
                            {loading || !report ? (
                                <p>Loading...</p>
                            ) : (
                                <CustomerTable
                                    customers={
                                        report.regularCustomers
                                    }
                                />
                            )}
                        </DataCard>
                    )}

                {(reportView === "all" ||
                    reportView === "pending") && (
                        <DataCard title="Pending Credit Customers">
                            {loading || !report ? (
                                <p>Loading...</p>
                            ) : (
                                <CustomerTable
                                    customers={
                                        report.pendingCreditCustomers
                                    }
                                />
                            )}
                        </DataCard>
                    )}
            </div>
        </>
    );
}