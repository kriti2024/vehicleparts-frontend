import { useEffect, useMemo, useState } from "react";
import {
    BarChart3,
    Bell,
    Car,
    CreditCard,
    FileText,
    LayoutDashboard,
    Mail,
    Package,
    Truck,
    Users,
    type LucideIcon,
} from "lucide-react";

import { getCustomers, type CustomerProfile } from "../../api/customer";
import DashboardShell from "../../components/Admin/DashboardShell";
import DataCard from "../../components/Admin/DataCard";
import StatCard from "../../components/Admin/StatCard";

const adminNav = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/parts", label: "Parts", icon: Package },
    { to: "/admin/vendors", label: "Vendors", icon: Truck },
    { to: "/admin/staff", label: "Staff", icon: Users },
    { to: "/admin/customers", label: "Customers", icon: Car },
    { to: "/admin/invoices", label: "Invoices", icon: FileText },
    { to: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export default function CustomersPage() {
    const [customers, setCustomers] = useState<CustomerProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                setCustomers(await getCustomers());
            } finally {
                setLoading(false);
            }
        };

        loadCustomers();
    }, []);

    const overdueCustomers = useMemo(
        () =>
            customers.filter((customer) => {
                if (!customer.creditDueDate || customer.creditBalance <= 0) return false;
                const dueDate = new Date(customer.creditDueDate);
                return dueDate < new Date();
            }),
        [customers]
    );

    const vehicleCount = customers.reduce(
        (total, customer) => total + (customer.vehicles ?? []).length,
        0
    );

    const totalCredit = customers.reduce(
        (total, customer) => total + customer.creditBalance,
        0
    );


    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center">
                Loading customers...
            </div>
        );
    }

    return (
        <DashboardShell role="Admin" nav={adminNav}>
            <div>
                <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
                    <div>
                        <div className="text-[11px] tracking-[0.3em] uppercase text-[oklch(0.5_0.012_70)]">
                            Customer Management
                        </div>
                        <h1 className="mt-3 text-5xl font-bold tracking-tight">
                            Customers & Vehicles
                        </h1>
                        <p className="mt-3 text-[oklch(0.5_0.012_70)]">
                            Review customer profiles, registered vehicles, credits, and reminders.
                        </p>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <StatCard label="Customers" value={`${customers.length}`} />
                    <StatCard label="Vehicles" value={`${vehicleCount}`} />
                    <StatCard label="Credit Balance" value={`Rs. ${totalCredit}`} />
                    <StatCard
                        label="Overdue Credits"
                        value={`${overdueCustomers.length}`}
                        hint="Unpaid for more than 1 month"
                    />
                </div>

                <div className="grid xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                        <DataCard title="Registered Customers">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-[oklch(0.88_0.012_80)] text-left">
                                            <th className="py-4 pr-4">Customer</th>
                                            <th className="py-4 pr-4">Contact</th>
                                            <th className="py-4 pr-4">Vehicles</th>
                                            <th className="py-4 pr-4">Spend</th>
                                            <th className="py-4 pr-4">Credit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="py-10 text-center text-[oklch(0.5_0.012_70)]"
                                                >
                                                    No registered customers yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            customers.map((customer) => (
                                                <tr
                                                    key={customer.id}
                                                    className="border-b border-[oklch(0.88_0.012_80)]"
                                                >
                                                    <td className="py-4 pr-4">
                                                        <div className="font-semibold">{customer.fullName}</div>
                                                        <div className="mt-1 text-xs text-[oklch(0.5_0.012_70)]">
                                                            {customer.email}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 pr-4">{customer.phone}</td>
                                                    <td className="py-4 pr-4">
                                                        {(customer.vehicles ?? []).map((vehicle) => (
                                                            <div key={vehicle.id} className="mb-1">
                                                                {vehicle.vehicleNumber} - {vehicle.vehicleBrand}{" "}
                                                                {vehicle.vehicleModel}
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td className="py-4 pr-4">Rs. {customer.totalSpend}</td>
                                                    <td className="py-4 pr-4">
                                                        <span
                                                            className={
                                                                overdueCustomers.some((item) => item.id === customer.id)
                                                                    ? "font-semibold text-red-500"
                                                                    : "font-semibold"
                                                            }
                                                        >
                                                            Rs. {customer.creditBalance}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </DataCard>
                    </div>

                    <div className="space-y-6">
                        <DataCard title="Automation Rules">
                            <div className="space-y-4">
                                <Rule
                                    icon={Bell}
                                    title="Low stock alert"
                                    text="Admin is notified when any part stock goes below 10 units."
                                />
                                <Rule
                                    icon={Mail}
                                    title="Credit reminder"
                                    text="Customers with unpaid credit older than one month receive email reminders."
                                />
                                <Rule
                                    icon={CreditCard}
                                    title="Loyalty program"
                                    text="A 10% discount applies when a single purchase is above Rs. 5000."
                                />
                            </div>
                        </DataCard>

                        <DataCard title="Reminder Queue">
                            <div className="space-y-3">
                                {overdueCustomers.length === 0 ? (
                                    <div className="text-sm text-[oklch(0.5_0.012_70)]">
                                        No overdue customer credits.
                                    </div>
                                ) : (
                                    overdueCustomers.map((customer) => (
                                        <div
                                            key={customer.id}
                                            className="rounded-2xl bg-[oklch(0.94_0.01_80)] p-4"
                                        >
                                            <div className="font-semibold">{customer.fullName}</div>
                                            <div className="mt-1 text-sm text-[oklch(0.5_0.012_70)]">
                                                Rs. {customer.creditBalance} due since {customer.creditDueDate}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </DataCard>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

function Rule({
    icon: Icon,
    title,
    text,
}: {
    icon: LucideIcon;
    title: string;
    text: string;
}) {
    return (
        <div className="flex gap-3 rounded-2xl bg-[oklch(0.94_0.01_80)] p-4">
            <Icon className="mt-0.5 h-5 w-5 text-[oklch(0.58_0.16_65)]" />
            <div>
                <div className="font-semibold">{title}</div>
                <p className="mt-1 text-sm text-[oklch(0.5_0.012_70)]">{text}</p>
            </div>
        </div>
    );
}
