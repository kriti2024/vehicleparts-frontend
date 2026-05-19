import { useEffect, useMemo, useState } from "react";
import {
    BarChart3,
    Bell,
    Check,
    FileText,
    LayoutDashboard,
    Package,
    Truck,
    Users,
} from "lucide-react";

import DashboardShell from "../../components/Admin/DashboardShell";
import DataCard from "../../components/Admin/DataCard";
import StatCard from "../../components/Admin/StatCard";
import {
    getAdminNotifications,
    markNotificationRead,
    type AdminNotification,
} from "../../api/admin";

const adminNav = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/parts", label: "Parts", icon: Package },
    { to: "/admin/vendors", label: "Vendors", icon: Truck },
    { to: "/admin/staff", label: "Staff", icon: Users },
    { to: "/admin/customers", label: "Customers", icon: Users },
    { to: "/admin/invoices", label: "Invoices", icon: FileText },
    { to: "/admin/reports", label: "Reports", icon: BarChart3 },
    { to: "/admin/notifications", label: "Notifications", icon: Bell },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [loading, setLoading] = useState(true);

    const unreadCount = useMemo(
        () => notifications.filter((item) => !item.isRead).length,
        [notifications]
    );

    const lowStockCount = useMemo(
        () => notifications.filter((item) => item.type === "LowStock").length,
        [notifications]
    );

    const loadNotifications = async () => {
        try {
            setLoading(true);

            const data = await getAdminNotifications();

            setNotifications(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            await loadNotifications();
        };

        fetchNotifications();
    }, []);

    const handleMarkRead = async (id: number) => {
        await markNotificationRead(id);
        setNotifications((current) =>
            current.map((item) =>
                item.notificationId === id
                    ? { ...item, isRead: true }
                    : item
            )
        );
    };

    return (
        <DashboardShell role="Admin" nav={adminNav}>
            <div>
                <div className="mb-10">
                    <div>
                        <div className="text-[11px] uppercase tracking-[0.3em] text-[oklch(0.5_0.012_70)]">
                            Admin Center
                        </div>
                        <h1 className="mt-3 text-5xl font-bold tracking-tight">
                            Notifications
                        </h1>
                        <p className="mt-3 text-[oklch(0.5_0.012_70)]">
                            Review automatic low-stock alerts.
                        </p>
                    </div>
                </div>

                <div className="mb-8 grid gap-6 md:grid-cols-3">
                    <StatCard label="Total Alerts" value={`${notifications.length}`} />
                    <StatCard label="Unread" value={`${unreadCount}`} />
                    <StatCard label="Low Stock" value={`${lowStockCount}`} />
                </div>

                <DataCard title="Recent Notifications">
                        {loading ? (
                            <div className="py-8 text-sm text-[oklch(0.5_0.012_70)]">
                                Loading notifications...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-8 text-sm text-[oklch(0.5_0.012_70)]">
                                No notifications available.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {notifications.map((item) => (
                                    <div
                                        key={item.notificationId}
                                        className={`flex flex-wrap items-start justify-between gap-4 rounded-2xl border p-4 ${
                                            item.isRead
                                                ? "border-[oklch(0.88_0.012_80)] bg-white"
                                                : "border-[oklch(0.74_0.16_65)] bg-[oklch(0.98_0.02_86)]"
                                        }`}
                                    >
                                        <div className="flex gap-3">
                                            <Bell className="mt-1 h-4 w-4 text-[oklch(0.58_0.16_75)]" />
                                            <div>
                                                <div className="font-medium">
                                                    {item.message}
                                                </div>
                                                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[oklch(0.5_0.012_70)]">
                                                    {item.type} / {new Date(item.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        {!item.isRead && (
                                            <button
                                                type="button"
                                                onClick={() => handleMarkRead(item.notificationId)}
                                                className="inline-flex items-center gap-2 rounded-xl border border-[oklch(0.88_0.012_80)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition hover:bg-[oklch(0.94_0.01_80)]"
                                            >
                                                <Check className="h-3.5 w-3.5" />
                                                Read
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                </DataCard>
            </div>
        </DashboardShell>
    );
}
