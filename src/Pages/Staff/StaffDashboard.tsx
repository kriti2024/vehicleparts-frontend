import { Link } from "react-router-dom";

import {
  PageHeader,
  StatCard,
  DataCard,
} from "../../components/staff/DashboardParts";

const stats = [
  {
    label: "Sales Today",
    value: "$4,820",
  },
  {
    label: "Invoices Issued",
    value: "11",
  },
  {
    label: "New Customers",
    value: "3",
  },
  {
    label: "Pending Credits",
    value: "2",
    hint: "Overdue > 30 days",
  },
];

const quickActions = [
  {
    to: "/staff/sales",
    title: "New Sale",
    desc: "Sell parts and generate invoice",
  },
  {
    to: "/staff/customers",
    title: "Register Customer",
    desc: "Add customer with vehicle",
  },
  {
    to: "/staff/search",
    title: "Customer Search",
    desc: "Search by name or vehicle",
  },
  {
    to: "/staff/reports",
    title: "Reports",
    desc: "View customer insights",
  },
];

const activities = [
  "Invoice INV-3120 emailed successfully",
  "Customer registered with vehicle details",
  "Brake pads sold — quantity 2",
  "Loyalty discount applied to invoice",
];

export default function StaffDashboard() {
  return (
    <>
      <PageHeader title="Welcome Back" subtitle="Staff dashboard overview" />

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
          />
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Quick Actions */}
        <DataCard title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="rounded-lg border border-gray-200 p-5 hover:border-amber-500 transition"
              >
                <div className="text-sm font-semibold text-gray-900">
                  {action.title}
                </div>

                <div className="text-xs text-gray-500 mt-1">{action.desc}</div>
              </Link>
            ))}
          </div>
        </DataCard>

        {/* Recent Activity */}
        <DataCard title="Recent Activity">
          <ul className="space-y-3 text-sm">
            {activities.map((activity, index) => (
              <li
                key={index}
                className="flex gap-3 border-b border-gray-100 pb-3 last:border-0"
              >
                <div className="h-2 w-2 rounded-full bg-amber-500 mt-2" />

                <span className="text-gray-600">{activity}</span>
              </li>
            ))}
          </ul>
        </DataCard>
      </div>
    </>
  );
}
