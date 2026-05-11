import { useEffect, useState } from "react";

import { PageHeader, DataCard } from "../../components/staff/DashboardParts";
import { getCustomers } from "../../api/customerApi";
import { createSale } from "../../api/salesApi";

import type { Customer } from "../../types/customer";
import type { Sale } from "../../types/sale";

export default function StaffSales() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [partId, setPartId] = useState("");
  const [quantity, setQuantity] = useState("1");

  const [createdSale, setCreatedSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCustomers();
        setCustomers(data);
      } catch {
        setError("Failed to load customers. Backend may not be running.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleCreateSale = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!customerId || !partId || !quantity) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setCreatedSale(null);

      const sale = await createSale({
        customerId: Number(customerId),
        items: [
          {
            partId: Number(partId),
            quantity: Number(quantity),
          },
        ],
      });

      setCreatedSale(sale);
      setPartId("");
      setQuantity("1");
    } catch {
      setError(
        "Failed to create sale. Check customer ID, part ID, stock, or backend.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="New Sale"
        subtitle="Create sales, apply loyalty discount, and generate invoices."
      />

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        <DataCard title="Create Sale">
          <form onSubmit={handleCreateSale} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Customer
              </label>

              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
              >
                <option value="">
                  {loading ? "Loading customers..." : "Select customer"}
                </option>

                {customers.map((customer) => (
                  <option key={customer.customerId} value={customer.customerId}>
                    {customer.fullName} - {customer.phone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Part ID
              </label>

              <input
                value={partId}
                onChange={(e) => setPartId(e.target.value)}
                required
                type="number"
                min={1}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
                placeholder="Enter part ID"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Quantity
              </label>

              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min={1}
                type="number"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
              />
            </div>

            <button
              disabled={saving}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
            >
              {saving ? "Creating Sale..." : "Create Sale"}
            </button>
          </form>
        </DataCard>

        <DataCard title="Generated Sale">
          {!createdSale ? (
            <p className="text-sm text-gray-500">
              Sale details will appear here after successful creation.
            </p>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm">
              <div className="mb-4">
                <p className="text-gray-500">Sale ID</p>
                <p className="text-2xl font-semibold text-gray-900">
                  #{createdSale.saleId}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Customer</p>
                  <p className="font-medium text-gray-900">
                    {createdSale.customerName || customerId}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-medium text-gray-900">
                    Rs. {createdSale.totalAmount ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Discount</p>
                  <p className="font-medium text-gray-900">
                    Rs. {createdSale.discountAmount ?? 0}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Final Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    Rs.{" "}
                    {createdSale.finalAmount ?? createdSale.totalAmount ?? "-"}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                Use this Sale ID in the Invoices page to view the generated
                invoice.
              </p>
            </div>
          )}
        </DataCard>
      </div>
    </>
  );
}
