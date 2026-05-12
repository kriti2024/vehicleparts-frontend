import { Link, useLocation } from "react-router-dom";
import { Bell, LogOut, type LucideIcon } from "lucide-react";
import { Logo } from "../Logo";

export type NavItem = {
    to: string;
    label: string;
    icon: LucideIcon;
};

type DashboardShellProps = {
    role: "Admin" | "Staff" | "Customer";
    nav: NavItem[];
    children: React.ReactNode;
};

export default function DashboardShell({
    role,
    nav,
    children,
}: DashboardShellProps) {
    const location = useLocation();

    return (
        <div className="min-h-screen flex bg-[oklch(0.965_0.012_85)] text-[oklch(0.205_0.012_60)]">
            {/* SIDEBAR */}
            <aside className="hidden md:flex w-72 flex-col border-r border-[oklch(0.92_0.012_80)]/10 bg-[oklch(0.18_0.012_60)] text-[oklch(0.92_0.012_80)]">

                {/* LOGO */}
                <div className="px-6 py-7 border-b border-[oklch(0.92_0.012_80)]/10">
                    <Logo dark />
                </div>

                {/* NAVIGATION */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {nav.map((item) => {
                        const active = location.pathname === item.to;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${active
                                    ? "bg-[oklch(0.74_0.16_65)] text-[oklch(0.18_0.012_60)] font-semibold"
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
                    <Link
                        to="/"
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-[oklch(0.92_0.012_80)]/70 hover:bg-[oklch(0.92_0.012_80)]/10 transition"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* CONTENT */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* HEADER */}
                <header className="h-16 border-b border-[oklch(0.88_0.012_80)] bg-[oklch(0.965_0.012_85)] flex items-center justify-between px-6">
                    <div className="text-[11px] tracking-[0.3em] uppercase text-[oklch(0.5_0.012_70)]">
                        {role} Dashboard
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative h-10 w-10 rounded-full hover:bg-[oklch(0.92_0.014_80)] grid place-items-center transition">
                            <Bell className="h-4 w-4" />

                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[oklch(0.74_0.16_65)]" />
                        </button>

                        <div className="h-10 w-10 rounded-full bg-[oklch(0.205_0.012_60)] text-[oklch(0.97_0.012_85)] grid place-items-center text-sm font-bold">
                            {role[0]}
                        </div>
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