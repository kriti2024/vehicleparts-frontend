import { NavLink, Link } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  FileText,
  BarChart3,
  Search,
  LogOut,
  type LucideIcon,
} from "lucide-react";

import { cn } from "../../lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  {
    to: "/staff",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    to: "/staff/customers",
    label: "Customers",
    icon: Users,
  },
  {
    to: "/staff/sales",
    label: "New Sale",
    icon: ShoppingCart,
  },
  {
    to: "/staff/invoices",
    label: "Invoices",
    icon: FileText,
  },
  {
    to: "/staff/search",
    label: "Search",
    icon: Search,
  },
  {
    to: "/staff/reports",
    label: "Reports",
    icon: BarChart3,
  },
];

export default function StaffSidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col bg-gray-900 text-gray-100 border-r border-gray-800">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full border border-gray-600 grid place-items-center">
            <span className="text-[10px] font-bold tracking-widest">VP</span>
          </div>

          <div>
            <div className="font-semibold tracking-[0.2em] text-xs">
              VEHICLE PARTS
            </div>

            <div className="text-[10px] tracking-widest uppercase text-gray-400">
              Staff Panel
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/staff"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",

                isActive
                  ? "bg-amber-500 text-black font-medium"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white",
              )
            }
          >
            <Icon className="h-4 w-4" />

            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
