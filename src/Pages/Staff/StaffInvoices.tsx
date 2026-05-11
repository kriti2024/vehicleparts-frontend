import { useState } from "react";

import { PageHeader, DataCard } from "../../components/staff/DashboardParts";
import { getInvoiceBySaleId } from "../../api/invoiceApi";
import type { Invoice } from "../../types/invoice";

export default function StaffInvoices() {
  const [saleId, setSaleId] = useState("");
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearchInvoice = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!saleId.trim()) {
      setError("Please enter sale ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setInvoice(null);

      const data = await getInvoiceBySaleId(Number(saleId));
      setInvoice(data);
    } catch {
      setError("Invoice not found or backend is not running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Invoices"
        subtitle="Search and view generated invoice details by sale ID."
      />

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <DataCard title="Find Invoice">
        <form onSubmit={handleSearchInvoice} className="flex gap-3 mb-6">
          <input
            value={saleId}
            onChange={(e) => setSaleId(e.target.value)}
            type="number"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
            placeholder="Enter sale ID"
          />

          <button
            disabled={loading}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
          >
            {loading ? "Loading..." : "Search Invoice"}
          </button>
        </form>

        {!invoice ? (
          <p className="text-sm text-gray-500">
            Enter a sale ID to view invoice details.
          </p>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-start justify-between border-b border-gray-200 pb-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Invoice {invoice.invoiceNumber || "-"}
                </h2>

                <p className="text-sm text-gray-500">
                  Sale ID: {invoice.saleId || saleId}
                </p>
              </div>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                Generated
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-medium text-gray-900">
                  {invoice.customerName || "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Created At</p>
                <p className="font-medium text-gray-900">
                  {invoice.createdAt
                    ? new Date(invoice.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Total Amount</p>
                <p className="font-medium text-gray-900">
                  Rs. {invoice.totalAmount ?? "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Discount</p>
                <p className="font-medium text-gray-900">
                  Rs. {invoice.discountAmount ?? 0}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Final Amount</p>
                <p className="text-lg font-semibold text-gray-900">
                  Rs. {invoice.finalAmount ?? invoice.totalAmount ?? "-"}
                </p>
              </div>
            </div>
          </div>
        )}
      </DataCard>
    </>
  );
}
