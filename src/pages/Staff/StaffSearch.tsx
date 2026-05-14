import { useMemo, useState } from "react";
import { Car, FileText, Search, UserRound } from "lucide-react";

import {
  DataCard,
  DetailRow,
  EmptyState,
  Field,
  InlineAlert,
  PageHeader,
  PrimaryButton,
  StatCard,
  TableHead,
  TableShell,
  Td,
  Th,
} from "../../components/staff/DashboardParts";
import { getCustomerWithVehicles, searchCustomers } from "../../api/customerApi";
import { getCustomerSales } from "../../api/salesApi";
import type { Customer, CustomerWithVehicles } from "../../types/customer";
import type { Sale } from "../../types/sale";

export default function StaffSearch() {
  const [keyword, setKeyword] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithVehicles | null>(null);
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const totalSpent = useMemo(
    () => salesHistory.reduce((sum, sale) => sum + (sale.finalAmount ?? sale.totalAmount ?? 0), 0),
    [salesHistory],
  );

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!keyword.trim()) {
      setError("Please enter vehicle number, phone, ID, email, or name.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setSelectedCustomer(null);
      setSalesHistory([]);
      const data = await searchCustomers(keyword.trim());
      setCustomers(data);
      setMessage(`Found ${data.length} customer result${data.length === 1 ? "" : "s"}.`);
    } catch {
      setError("Search failed. Backend may not be running.");
    } finally {
      setLoading(false);
    }
  };

  const loadDetails = async (customerId: number) => {
    try {
      setDetailsLoading(true);
      setError("");
      const [details, sales] = await Promise.all([
        getCustomerWithVehicles(customerId),
        getCustomerSales(customerId),
      ]);
      setSelectedCustomer(details);
      setSalesHistory(sales);
    } catch {
      setError("Could not load customer details, vehicles, or history.");
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Customer Finder"
        title="Search Customers"
        subtitle="Find customers by vehicle number, phone, customer ID, email, or name, then open their vehicles and sales history."
        message={message}
      />

      {error && <InlineAlert>{error}</InlineAlert>}

      <div className="mb-6 grid md:grid-cols-3 gap-5">
        <StatCard icon={Search} label="Results" value={loading ? "..." : customers.length} hint="Matching records" tone="dark" />
        <StatCard icon={Car} label="Vehicles" value={selectedCustomer?.vehicles.length ?? 0} hint="Selected customer" tone="amber" />
        <StatCard icon={FileText} label="History" value={salesHistory.length} hint={`Rs. ${totalSpent} total spend`} />
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <DataCard className="xl:col-span-2" title="Customer Search">
          <form onSubmit={handleSearch} className="mb-6 grid md:grid-cols-[1fr_auto] gap-4 items-end">
            <Field
              label="Search Keyword"
              value={keyword}
              onChange={setKeyword}
              placeholder="Vehicle no., phone, ID, email, or name"
            />
            <PrimaryButton disabled={loading} icon={Search}>
              {loading ? "Searching..." : "Search"}
            </PrimaryButton>
          </form>

          {customers.length === 0 ? (
            <EmptyState title="No search results yet" text="Search by vehicle number, phone, ID, email, or name." />
          ) : (
            <TableShell>
              <TableHead>
                <Th>Name</Th>
                <Th>Phone</Th>
                <Th>Email</Th>
                <Th>Open</Th>
              </TableHead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.customerId}>
                    <Td>
                      <div className="font-semibold text-[oklch(0.18_0.012_60)]">{customer.fullName}</div>
                      <div className="mt-1 text-xs text-[oklch(0.5_0.012_70)]">ID #{customer.customerId}</div>
                    </Td>
                    <Td>{customer.phone}</Td>
                    <Td>{customer.email || "-"}</Td>
                    <Td>
                      <button
                        type="button"
                        onClick={() => loadDetails(customer.customerId)}
                        className="rounded-xl bg-[oklch(0.205_0.012_60)] px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
                      >
                        View
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </DataCard>

        <DataCard title="Selected Customer">
          {detailsLoading ? (
            <p className="text-sm text-[oklch(0.5_0.012_70)]">Loading customer details...</p>
          ) : !selectedCustomer ? (
            <EmptyState title="No customer opened" text="Choose View from a result row." />
          ) : (
            <div className="space-y-4">
              <div className="rounded-3xl bg-[oklch(0.18_0.012_60)] p-5 text-white">
                <UserRound className="h-5 w-5" />
                <div className="mt-4 text-xl font-bold">{selectedCustomer.fullName}</div>
                <div className="mt-1 text-sm opacity-70">{selectedCustomer.phone}</div>
              </div>
              <DetailRow label="Email" value={selectedCustomer.email || "-"} />
              <DetailRow label="Vehicles" value={selectedCustomer.vehicles.length} strong />
              <DetailRow label="Sales" value={salesHistory.length} strong />
              <DetailRow label="Total Spent" value={`Rs. ${totalSpent}`} strong />

              <div className="space-y-3 pt-2">
                {selectedCustomer.vehicles.map((vehicle) => (
                  <div key={vehicle.vehicleId} className="rounded-2xl bg-[oklch(0.94_0.01_80)] p-4">
                    <div className="font-bold text-[oklch(0.18_0.012_60)]">{vehicle.vehicleNumber}</div>
                    <div className="mt-1 text-sm text-[oklch(0.5_0.012_70)]">{vehicle.model}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DataCard>
      </div>
    </>
  );
}
