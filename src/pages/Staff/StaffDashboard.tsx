import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Car,
  CreditCard,
  FileText,
  PackageSearch,
  Search,
  ShoppingCart,
  UserPlus,
  Users,
} from "lucide-react";

import {
  ActionCard,
  DataCard,
  DetailRow,
  PageHeader,
  StatCard,
  StatusPill,
} from "../../components/staff/DashboardParts";
import { getCustomers } from "../../api/customerApi";
import { getCustomerReports } from "../../api/reportApi";
import type { Customer } from "../../types/customer";
import type { CustomerReport } from "../../types/report";

export default function StaffDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [report, setReport] = useState<CustomerReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [customerData, reportData] = await Promise.all([
          getCustomers(),
          getCustomerReports(),
        ]);
        setCustomers(customerData);
        setReport(reportData);
        setMessage("Staff workspace is connected to customer, sales, invoice, and report modules.");
      } catch {
        setMessage("Showing the staff workspace. Start the backend to load live counts.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const totals = useMemo(() => {
    const pending = report?.pendingCreditCustomers ?? [];
    return {
      customers: customers.length,
      regulars: report?.regularCustomers.length ?? 0,
      highSpenders: report?.highSpenders.length ?? 0,
      pendingCredit: pending.reduce((sum, customer) => sum + (customer.pendingAmount ?? 0), 0),
    };
  }, [customers.length, report]);

  return (
    <>
      <PageHeader
        eyebrow="Staff Desk"
        title="Overview"
        subtitle="A customer-style staff dashboard for registering customers, selling parts, creating invoices, and tracking customer value."
        message={message}
      />

      <div className="mb-8 grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          icon={Users}
          label="Customers"
          value={loading ? "..." : totals.customers}
          hint="Registered customer records"
          tone="dark"
        />
        <StatCard
          icon={ShoppingCart}
          label="Sales"
          value="Ready"
          hint="Create sale invoices"
          tone="amber"
        />
        <StatCard
          icon={BarChart3}
          label="High Spenders"
          value={loading ? "..." : totals.highSpenders}
          hint="Top customer segment"
        />
        <StatCard
          icon={FileText}
          label="Credit Due"
          value={loading ? "..." : `Rs. ${totals.pendingCredit}`}
          hint="Pending customer balance"
        />
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <DataCard className="xl:col-span-2" title="Quick Actions">
          <div className="grid sm:grid-cols-2 gap-4">
            <ActionCard
              href="/staff/customers"
              icon={UserPlus}
              title="Register Customer"
              text="Add customer profile and vehicle details from one staff screen."
            />
            <ActionCard
              href="/staff/sales"
              icon={ShoppingCart}
              title="Sell Vehicle Parts"
              text="Build a multi-item sale and capture the invoice-ready totals."
            />
            <ActionCard
              href="/staff/search"
              icon={Search}
              title="Search Customer"
              text="Find customers by name, phone, ID, email, or vehicle number."
            />
            <ActionCard
              href="/staff/reports"
              icon={BarChart3}
              title="Customer Reports"
              text="Review regulars, high spenders, and pending credit customers."
            />
            <ActionCard
              href="/staff/service-queue"
              icon={CalendarDays}
              title="Service Queue"
              text="Track walk-in jobs, workshop status, priority, and ready vehicles."
            />
            <ActionCard
              href="/staff/credits"
              icon={CreditCard}
              title="Credit Follow-Up"
              text="Manage pending balances, reminder notes, and payment promises."
            />
            <ActionCard
              href="/staff/stock-alerts"
              icon={PackageSearch}
              title="Stock Alerts"
              text="Review low parts, reorder levels, and vendor reorder notes."
            />
          </div>
        </DataCard>

        <DataCard title="Staff Checklist">
          <div className="space-y-3">
            <DetailRow label="Customer registration" value={<StatusPill tone="success">Ready</StatusPill>} />
            <DetailRow label="Vehicle records" value={<StatusPill tone="success">Ready</StatusPill>} />
            <DetailRow label="Parts sale" value={<StatusPill tone="success">Ready</StatusPill>} />
            <DetailRow label="Invoice email" value={<StatusPill tone="warning">Mail ready</StatusPill>} />
            <DetailRow label="Service queue" value={<StatusPill tone="success">Ready</StatusPill>} />
            <DetailRow label="Stock alerts" value={<StatusPill tone="success">Ready</StatusPill>} />
            <DetailRow label="Search coverage" value="Name, phone, ID, email, vehicle" strong />
          </div>
        </DataCard>

        <DataCard className="xl:col-span-3" title="Customer Operations Flow">
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: "1", title: "Register", text: "Capture customer contact and vehicle number.", icon: UserPlus },
              { label: "2", title: "Verify", text: "Open details, vehicles, and previous sale history.", icon: Car },
              { label: "3", title: "Sell", text: "Add parts, quantity, and generate the sale record.", icon: ShoppingCart },
              { label: "4", title: "Send", text: "Open invoice and prepare email for the customer.", icon: FileText },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-3xl bg-[oklch(0.94_0.01_80)] p-5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-xl bg-white px-3 py-1 text-xs font-bold text-[oklch(0.42_0.05_65)]">
                      {item.label}
                    </span>
                    <Icon className="h-4 w-4 text-[oklch(0.4_0.012_60)]" />
                  </div>
                  <div className="mt-5 text-base font-bold text-[oklch(0.18_0.012_60)]">{item.title}</div>
                  <p className="mt-2 text-sm leading-6 text-[oklch(0.5_0.012_70)]">{item.text}</p>
                </div>
              );
            })}
          </div>
        </DataCard>
      </div>
    </>
  );
}
