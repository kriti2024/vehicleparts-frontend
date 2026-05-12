import { useEffect, useState } from "react";

import { PageHeader, DataCard } from "../../components/staff/DashboardParts";
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
    return <p className="text-sm text-gray-500">No records found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wider text-gray-500">
            <th className="py-3">Customer</th>
            <th className="py-3">Phone</th>
            <th className="py-3">Purchases</th>
            <th className="py-3">Spent</th>
            <th className="py-3">Pending</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customerId} className="border-b border-gray-100">
              <td className="py-3">
                <p className="font-medium text-gray-900">{customer.fullName}</p>
                <p className="text-xs text-gray-500">{customer.email || "-"}</p>
              </td>

              <td className="py-3 text-gray-600">{customer.phone}</td>

              <td className="py-3 text-gray-600">{customer.totalPurchases}</td>

              <td
                className={`py-3 ${
                  type === "spent"
                    ? "font-semibold text-gray-900"
                    : "text-gray-600"
                }`}
              >
                Rs. {customer.totalSpent}
              </td>

              <td
                className={`py-3 ${
                  type === "pending"
                    ? "font-semibold text-red-600"
                    : "text-gray-600"
                }`}
              >
                Rs. {customer.pendingAmount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function StaffReports() {
  const [report, setReport] = useState<CustomerReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCustomerReports();
        setReport(data);
      } catch {
        setError("Failed to load reports. Backend may not be running.");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const regularCount = report?.regularCustomers.length ?? 0;
  const highSpenderCount = report?.highSpenders.length ?? 0;
  const pendingCreditCount = report?.pendingCreditCustomers.length ?? 0;

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Customer reports for regular customers, high spenders, and pending credits."
      />

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <DataCard title="Regular Customers">
          <h2 className="text-3xl font-bold text-gray-900">
            {loading ? "..." : regularCount}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Customers with repeat purchases.
          </p>
        </DataCard>

        <DataCard title="High Spenders">
          <h2 className="text-3xl font-bold text-gray-900">
            {loading ? "..." : highSpenderCount}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Customers with highest total spend.
          </p>
        </DataCard>

        <DataCard title="Pending Credits">
          <h2 className="text-3xl font-bold text-gray-900">
            {loading ? "..." : pendingCreditCount}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Customers with unpaid balance.
          </p>
        </DataCard>
      </div>

      <div className="space-y-6">
        <DataCard title="High Spenders">
          {loading || !report ? (
            <p className="text-sm text-gray-500">
              Loading high spender report...
            </p>
          ) : (
            <CustomerTable customers={report.highSpenders} type="spent" />
          )}
        </DataCard>

        <DataCard title="Regular Customers">
          {loading || !report ? (
            <p className="text-sm text-gray-500">
              Loading regular customer report...
            </p>
          ) : (
            <CustomerTable
              customers={report.regularCustomers}
              type="purchases"
            />
          )}
        </DataCard>

        <DataCard title="Pending Credit Customers">
          {loading || !report ? (
            <p className="text-sm text-gray-500">
              Loading pending credit report...
            </p>
          ) : (
            <CustomerTable
              customers={report.pendingCreditCustomers}
              type="pending"
            />
          )}
        </DataCard>
      </div>
    </>
  );
}
