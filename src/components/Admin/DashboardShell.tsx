import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, LogOut, type LucideIcon } from "lucide-react";
import { Logo } from "../Logo";
import { useAuth } from "../../context/useAuth";

export type NavItem = {
    to: string;
    label: string;
    icon: LucideIcon;
};

type DashboardShellProps = {
    role: "Admin" | "Staff" | "Customer";
    nav: NavItem[];
    children: ReactNode;
};

export default function DashboardShell({
    role,
    nav,
    children,
}: DashboardShellProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const notificationPath =
        nav.find((item) => item.label === "Notifications")?.to
        ?? (role === "Admin" ? "/admin/notifications" : undefined)
        ?? nav.find((item) => item.label === "Reports")?.to
        ?? nav[0]?.to
        ?? "/";

    const profilePath =
        nav.find((item) => item.label === "Profile")?.to
        ?? nav.find((item) => item.label === "Customers")?.to
        ?? nav[0]?.to
        ?? "/";

    const currentSection =
        nav.find((item) => item.to === location.pathname)?.label
        ?? "Workspace";

    return (
        <div className="min-h-screen flex bg-[oklch(0.965_0.012_85)] text-[oklch(0.205_0.012_60)]">

            {/* SIDEBAR */}
            <aside className="hidden md:flex w-72 flex-col border-r border-[oklch(0.92_0.012_80)]/10 bg-[oklch(0.18_0.012_60)] text-[oklch(0.92_0.012_80)]">

                {/* LOGO */}
                <div className="px-6 py-7 border-b border-[oklch(0.92_0.012_80)]/10">
                    <Logo dark />
                </div>

                {/* NAVIGATION */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">

                    <div className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[oklch(0.92_0.012_80)]/35">
                        Workspace
                    </div>

                    {nav.map((item) => {
                        const active = location.pathname === item.to;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${active
                                        ? "bg-[oklch(0.74_0.16_65)] text-[oklch(0.18_0.012_60)] font-semibold shadow-[0_16px_36px_-24px_oklch(0.74_0.16_65)]"
                                        : "hover:bg-[oklch(0.92_0.012_80)]/10 text-[oklch(0.92_0.012_80)]/70"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* FOOTER */}
                <div className="p-4 border-t border-[oklch(0.92_0.012_80)]/10">

                    <div className="mb-3 rounded-2xl border border-[oklch(0.92_0.012_80)]/10 bg-[oklch(0.92_0.012_80)]/5 p-4">

                        <div className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.92_0.012_80)]/40">
                            Today
                        </div>

                        <div className="mt-2 text-sm font-semibold text-[oklch(0.92_0.012_80)]">
                            Operations ready
                        </div>

                        <div className="mt-1 text-xs text-[oklch(0.92_0.012_80)]/50">
                            Sales, service, credits, and stock
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            logout();
                            navigate("/login");
                        }}
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-[oklch(0.92_0.012_80)]/70 hover:bg-[oklch(0.92_0.012_80)]/10 transition"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* CONTENT */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* HEADER */}
                <header className="h-16 border-b border-[oklch(0.88_0.012_80)] bg-[oklch(0.985_0.008_85)]/90 flex items-center justify-between px-6 shadow-[0_12px_30px_-28px_oklch(0.2_0.012_60)]">

                    <div>
                        <div className="text-[10px] tracking-[0.3em] uppercase text-[oklch(0.5_0.012_70)]">
                            {role} Dashboard
                        </div>

                        <div className="mt-1 text-sm font-semibold text-[oklch(0.22_0.012_60)]">
                            {currentSection}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">

                        {/* SHOW BELL ONLY FOR ADMIN & CUSTOMER */}
                        {role !== "Staff" && (
                            <button
                                type="button"
                                onClick={() => navigate(notificationPath)}
                                aria-label="Open notifications"
                                title="Open notifications"
                                className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[oklch(0.205_0.012_60)] transition hover:bg-[oklch(0.92_0.014_80)]"
                            >
                                <Bell className="h-4 w-4" />

                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[oklch(0.74_0.16_65)]" />
                            </button>
                        )}

                        {/* PROFILE */}
                        <button
                            type="button"
                            onClick={() => navigate(profilePath)}
                            aria-label="Open profile"
                            title="Open profile"
                            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 bg-[oklch(0.205_0.012_60)] text-sm font-bold text-[oklch(0.97_0.012_85)] transition hover:opacity-90"
                        >
                            {role[0]}
                        </button>
                    </div>
                </header>

                {/* MAIN */}
                <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}