import { useEffect, useState } from "react";

import {
  PageHeader,
  StatCard,
  DataCard,
} from "../../components/staff/DashboardParts";

import { getCustomers } from "../../api/customerApi";

export default function StaffDashboard() {
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const customers = await getCustomers();
        setCustomerCount(customers.length);
      } catch {
        setCustomerCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <>
      <PageHeader
        title="Welcome Back"
        subtitle="Vehicle Parts staff dashboard overview."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Customers"
          value={loading ? "..." : customerCount}
          hint="Registered customers"
        />

        <StatCard label="Sales" value="Ready" hint="Sales module connected" />

        <StatCard
          label="Invoices"
          value="Ready"
          hint="Invoice API integrated"
        />

        <StatCard
          label="Reports"
          value="Ready"
          hint="Customer report API connected"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <DataCard title="Quick Actions">
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="/staff/customers"
              className="rounded-xl border border-gray-200 p-4 hover:border-amber-500 transition"
            >
              <h3 className="font-semibold text-gray-900 mb-1">
                Register Customer
              </h3>
              <p className="text-sm text-gray-500">
                Add customer and vehicle details.
              </p>
            </a>

            <a
              href="/staff/sales"
              className="rounded-xl border border-gray-200 p-4 hover:border-amber-500 transition"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Create Sale</h3>
              <p className="text-sm text-gray-500">
                Generate sale and invoice.
              </p>
            </a>

            <a
              href="/staff/search"
              className="rounded-xl border border-gray-200 p-4 hover:border-amber-500 transition"
            >
              <h3 className="font-semibold text-gray-900 mb-1">
                Search Customer
              </h3>
              <p className="text-sm text-gray-500">
                Find customer records quickly.
              </p>
            </a>

            <a
              href="/staff/reports"
              className="rounded-xl border border-gray-200 p-4 hover:border-amber-500 transition"
            >
              <h3 className="font-semibold text-gray-900 mb-1">View Reports</h3>
              <p className="text-sm text-gray-500">
                View customer reports and credits.
              </p>
            </a>
          </div>
        </DataCard>

        <DataCard title="System Status">
          <div className="space-y-4 text-sm">
            {[
              "Customer Module",
              "Sales Module",
              "Invoice Module",
              "Reports Module",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
              >
                <span className="text-gray-600">{item}</span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Connected
                </span>
              </div>
            ))}
          </div>
        </DataCard>
      </div>
    </>
  );
}
