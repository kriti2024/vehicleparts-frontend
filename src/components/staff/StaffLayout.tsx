import { Outlet } from "react-router-dom";
import {
  BarChart3,
  CalendarDays,
  CreditCard,
  FileText,
  LayoutDashboard,
  PackageSearch,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";

import DashboardShell from "../Admin/DashboardShell";

const staffNav = [
  { to: "/staff", label: "Overview", icon: LayoutDashboard },
  { to: "/staff/customers", label: "Customers", icon: Users },
  { to: "/staff/sales", label: "New Sale", icon: ShoppingCart },
  { to: "/staff/invoices", label: "Invoices", icon: FileText },
  { to: "/staff/search", label: "Search", icon: Search },
  { to: "/staff/service-queue", label: "Service Queue", icon: CalendarDays },
  { to: "/staff/credits", label: "Credits", icon: CreditCard },
  { to: "/staff/stock-alerts", label: "Stock Alerts", icon: PackageSearch },
  { to: "/staff/reports", label: "Reports", icon: BarChart3 },
];

export function StaffLayout() {
  return (
    <DashboardShell role="Staff" nav={staffNav}>
      <Outlet />
    </DashboardShell>
  );
}
