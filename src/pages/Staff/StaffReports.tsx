import { useEffect, useMemo, useState } from "react";
import { BarChart3, CreditCard, Download, Star, Users } from "lucide-react";

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
import type { CustomerReport, CustomerSummary } from "../../types/report";

function CustomerTable({
  customers,
  type,
}: {
  customers: CustomerSummary[];
  type: "spent" | "purchases" | "pending";
}) {
  if (customers.length === 0) {
    return <EmptyState title="No records found" text="Report data will appear here when available." />;
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
              <p className="font-semibold text-[oklch(0.18_0.012_60)]">{customer.fullName}</p>
              <p className="mt-1 text-xs text-[oklch(0.5_0.012_70)]">{customer.email || "-"}</p>
            </Td>
            <Td>{customer.phone}</Td>
            <Td className={type === "purchases" ? "font-bold text-[oklch(0.18_0.012_60)]" : ""}>
              {customer.totalPurchases}
            </Td>
            <Td className={type === "spent" ? "font-bold text-[oklch(0.18_0.012_60)]" : ""}>
              Rs. {customer.totalSpent}
            </Td>
            <Td className={type === "pending" ? "font-bold text-red-600" : ""}>
              Rs. {customer.pendingAmount}
            </Td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

export default function StaffReports() {
  const [report, setReport] = useState<CustomerReport | null>(null);
  const [reportView, setReportView] = useState("all");
  const [minimumSpend, setMinimumSpend] = useState("0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getCustomerReports();
        setReport(data);
        setMessage("Customer reports loaded for staff review.");
      } catch {
        setError("Failed to load reports. Backend may not be running.");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const summary = useMemo(() => {
    const regulars = report?.regularCustomers ?? [];
    const highSpenders = report?.highSpenders ?? [];
    const pending = report?.pendingCreditCustomers ?? [];

    return {
      regularCount: regulars.length,
      highSpenderCount: highSpenders.length,
      pendingCreditCount: pending.length,
      highSpenderTotal: highSpenders.reduce((sum, customer) => sum + (customer.totalSpent ?? 0), 0),
      pendingTotal: pending.reduce((sum, customer) => sum + (customer.pendingAmount ?? 0), 0),
    };
  }, [report]);

  const handleExport = () => {
    if (!report) return;

    const rows = [
      ["Type", "Customer", "Phone", "Email", "Purchases", "Spent", "Pending"],
      ...report.highSpenders.map((customer) => ["High Spender", customer.fullName, customer.phone, customer.email, customer.totalPurchases, customer.totalSpent, customer.pendingAmount]),
      ...report.regularCustomers.map((customer) => ["Regular", customer.fullName, customer.phone, customer.email, customer.totalPurchases, customer.totalSpent, customer.pendingAmount]),
      ...report.pendingCreditCustomers.map((customer) => ["Pending Credit", customer.fullName, customer.phone, customer.email, customer.totalPurchases, customer.totalSpent, customer.pendingAmount]),
    ];

    const csv = rows
      .map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "staff-customer-reports.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredHighSpenders = useMemo(
    () => (report?.highSpenders ?? []).filter((customer) => customer.totalSpent >= Number(minimumSpend || 0)),
    [minimumSpend, report?.highSpenders],
  );

  const topCustomer = filteredHighSpenders[0];

  return (
    <>
      <PageHeader
        eyebrow="Customer Intelligence"
        title="Reports"
        subtitle="Review regular customers, high spenders, and pending credit customers from the staff dashboard."
        message={message}
        action={
          <PrimaryButton type="button" icon={Download} variant="outline" disabled={!report} onClick={handleExport}>
            Export CSV
          </PrimaryButton>
        }
      />

      {error && <InlineAlert>{error}</InlineAlert>}

      <DataCard className="mb-6" title="Report Controls">
        <div className="grid md:grid-cols-3 gap-5">
          <SelectField
            label="Report View"
            value={reportView}
            onChange={setReportView}
            options={[
              { value: "all", label: "All reports" },
              { value: "high", label: "High spenders only" },
              { value: "regular", label: "Regular customers only" },
              { value: "pending", label: "Pending credits only" },
            ]}
          />
          <SelectField
            label="Minimum Spend"
            value={minimumSpend}
            onChange={setMinimumSpend}
            options={[
              { value: "0", label: "Any spend" },
              { value: "5000", label: "Rs. 5,000+" },
              { value: "10000", label: "Rs. 10,000+" },
              { value: "25000", label: "Rs. 25,000+" },
            ]}
          />
          <div className="rounded-2xl bg-[oklch(0.94_0.01_80)] p-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.5_0.012_70)]">Top Customer</div>
            <div className="mt-2 font-bold text-[oklch(0.18_0.012_60)]">{topCustomer?.fullName ?? "-"}</div>
            <div className="mt-1 text-sm text-[oklch(0.5_0.012_70)]">Rs. {topCustomer?.totalSpent ?? 0}</div>
          </div>
        </div>
      </DataCard>

      <div className="mb-6 grid md:grid-cols-4 gap-5">
        <StatCard icon={Users} label="Regulars" value={loading ? "..." : summary.regularCount} hint="Repeat purchase customers" tone="dark" />
        <StatCard icon={Star} label="High Spenders" value={loading ? "..." : summary.highSpenderCount} hint={`Rs. ${summary.highSpenderTotal} total`} tone="amber" />
        <StatCard icon={CreditCard} label="Pending Credit" value={loading ? "..." : summary.pendingCreditCount} hint={`Rs. ${summary.pendingTotal} unpaid`} />
        <StatCard icon={BarChart3} label="Report Types" value="3" hint="Regular, spend, credit" />
      </div>

      <div className="space-y-6">
        {(reportView === "all" || reportView === "high") && <DataCard title="High Spenders">
          {loading || !report ? (
            <p className="text-sm text-[oklch(0.5_0.012_70)]">Loading high spender report...</p>
          ) : (
            <CustomerTable customers={filteredHighSpenders} type="spent" />
          )}
        </DataCard>}

        {(reportView === "all" || reportView === "regular") && <DataCard title="Regular Customers">
          {loading || !report ? (
            <p className="text-sm text-[oklch(0.5_0.012_70)]">Loading regular customer report...</p>
          ) : (
            <CustomerTable customers={report.regularCustomers} type="purchases" />
          )}
        </DataCard>}

        {(reportView === "all" || reportView === "pending") && <DataCard title="Pending Credit Customers">
          {loading || !report ? (
            <p className="text-sm text-[oklch(0.5_0.012_70)]">Loading pending credit report...</p>
          ) : (
            <CustomerTable customers={report.pendingCreditCustomers} type="pending" />
          )}
        </DataCard>}
      </div>
    </>
  );
}
