import { useState } from "react";

import { PageHeader, DataCard } from "../../components/staff/DashboardParts";
import { searchCustomers } from "../../api/customerApi";
import type { Customer } from "../../types/customer";

export default function StaffSearch() {
  const [keyword, setKeyword] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!keyword.trim()) {
      setError("Please enter name, phone, or vehicle number.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await searchCustomers(keyword);
      setCustomers(data);
    } catch {
      setError("Search failed. Backend may not be running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Search"
        subtitle="Search customers by name, phone, or vehicle number."
      />

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <DataCard title="Customer Search">
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
            placeholder="Search by name, phone, or vehicle"
          />

          <button
            disabled={loading}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {customers.length === 0 ? (
          <p className="text-sm text-gray-500">No search results yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wider text-gray-500">
                  <th className="py-3">Name</th>
                  <th className="py-3">Phone</th>
                  <th className="py-3">Email</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.customerId}
                    className="border-b border-gray-100"
                  >
                    <td className="py-3 font-medium text-gray-900">
                      {customer.fullName}
                    </td>
                    <td className="py-3 text-gray-600">{customer.phone}</td>
                    <td className="py-3 text-gray-600">
                      {customer.email || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DataCard>
    </>
  );
}
