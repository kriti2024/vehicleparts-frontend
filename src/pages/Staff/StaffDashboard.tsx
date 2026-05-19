import { useEffect, useMemo, useState } from "react";

import {
    BarChart3,
    FileText,
    Search,
    ShoppingCart,
    UserPlus,
    Users,
} from "lucide-react";

import {
    ActionCard,
    DataCard,
    PageHeader,
    StatCard,
} from "../../components/staff/DashboardParts";

import { getCustomers } from "../../api/customerApi";
import { getCustomerReports } from "../../api/reportApi";

import type { Customer } from "../../types/customer";
import type { CustomerReport } from "../../types/report";

export default function StaffDashboard() {
    const [customers, setCustomers] =
        useState<Customer[]>([]);

    const [report, setReport] =
        useState<CustomerReport | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");

    useEffect(() => {
        let cancelled = false;

        const fetchDashboard =
            async () => {
                try {
                    const [
                        customerData,
                        reportData,
                    ] = await Promise.all([
                        getCustomers(),
                        getCustomerReports(),
                    ]);

                    if (!cancelled) {
                        setCustomers(customerData);
                        setReport(reportData);

                        setMessage(
                            "Dashboard loaded successfully."
                        );
                    }
                } catch {
                    if (!cancelled) {
                        setMessage(
                            "Unable to load dashboard data."
                        );
                    }
                } finally {
                    if (!cancelled) {
                        setLoading(false);
                    }
                }
            };

        fetchDashboard();

        return () => {
            cancelled = true;
        };
    }, []);

    const totals = useMemo(() => {
        const pending =
            report?.pendingCreditCustomers ??
            [];

        return {
            customers: customers.length,

            regularCustomers:
                report?.regularCustomers
                    .length ?? 0,

            highSpenders:
                report?.highSpenders.length ??
                0,

            pendingCredit:
                pending.reduce(
                    (sum, customer) =>
                        sum +
                        (customer.pendingAmount ??
                            0),
                    0
                ),
        };
    }, [customers.length, report]);

    return (
        <>
            <PageHeader
                eyebrow="Staff Dashboard"
                title="Overview"
                subtitle="Manage customers, sales, invoices, and reports."
                message={message}
            />

            <div className="mb-8 grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard
                    icon={Users}
                    label="Customers"
                    value={
                        loading
                            ? "..."
                            : totals.customers
                    }
                    hint="Registered customers"
                    tone="dark"
                />

                <StatCard
                    icon={ShoppingCart}
                    label="Regular Customers"
                    value={
                        loading
                            ? "..."
                            : totals.regularCustomers
                    }
                    hint="Returning customers"
                    tone="amber"
                />

                <StatCard
                    icon={BarChart3}
                    label="High Spenders"
                    value={
                        loading
                            ? "..."
                            : totals.highSpenders
                    }
                    hint="Top spending customers"
                />

                <StatCard
                    icon={FileText}
                    label="Pending Credit"
                    value={
                        loading
                            ? "..."
                            : `Rs. ${totals.pendingCredit}`
                    }
                    hint="Outstanding payments"
                />
            </div>

            <DataCard title="Operations">
                <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-4">
                    <ActionCard
                        href="/staff/customers"
                        icon={UserPlus}
                        title="Customer Registration"
                        text="Register customers and vehicle details."
                    />

                    <ActionCard
                        href="/staff/sales"
                        icon={ShoppingCart}
                        title="Sales & Invoices"
                        text="Create sales invoices and manage purchases."
                    />

                    <ActionCard
                        href="/staff/search"
                        icon={Search}
                        title="Customer Search"
                        text="Search customers using name, phone, ID, or vehicle number."
                    />

                    <ActionCard
                        href="/staff/reports"
                        icon={BarChart3}
                        title="Customer Reports"
                        text="View regular customers, high spenders, and pending credits."
                    />
                </div>
            </DataCard>
        </>
    );
}