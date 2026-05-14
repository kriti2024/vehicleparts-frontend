import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, PackageCheck, PackageSearch, Plus, ShoppingCart } from "lucide-react";

import {
  DataCard,
  DetailRow,
  EmptyState,
  Field,
  PageHeader,
  PrimaryButton,
  SelectField,
  StatCard,
  StatusPill,
  TableHead,
  TableShell,
  Td,
  Th,
} from "../../components/staff/DashboardParts";
import {
  getStockAlerts,
  restockItem,
  type StockAlert,
} from "../../api/staffOperationsApi";

const initialStock: StockAlert[] = [
  { id: "P-101", part: "Brake Pad Set", category: "Brakes", stock: 4, reorderLevel: 8, vendor: "Axleworks Stock", status: "Low" },
  { id: "P-102", part: "Engine Oil 5W-30", category: "Fluids", stock: 18, reorderLevel: 10, vendor: "Axleworks Stock", status: "OK" },
  { id: "P-104", part: "Air Filter", category: "Filters", stock: 2, reorderLevel: 6, vendor: "Axleworks Stock", status: "Critical" },
  { id: "P-107", part: "Car Battery", category: "Electrical", stock: 6, reorderLevel: 5, vendor: "Axleworks Stock", status: "OK" },
];

export default function StaffStockAlerts() {
  const [items, setItems] = useState<StockAlert[]>(initialStock);
  const [filter, setFilter] = useState("all");
  const [reorderNote, setReorderNote] = useState("");
  const [message, setMessage] = useState("");

  const filteredItems = useMemo(
    () => items.filter((item) => filter === "all" || item.status === filter),
    [filter, items],
  );

  useEffect(() => {
    const loadStockAlerts = async () => {
      try {
        setItems(await getStockAlerts(filter));
        setMessage("Stock alerts connected to backend.");
      } catch {
        setMessage("Showing fallback stock alerts. Start backend for live updates.");
      }
    };

    loadStockAlerts();
  }, [filter]);

  const summary = useMemo(
    () => ({
      low: items.filter((item) => item.status === "Low").length,
      critical: items.filter((item) => item.status === "Critical").length,
      healthy: items.filter((item) => item.status === "OK").length,
      reorderValue: items
        .filter((item) => item.status !== "OK")
        .reduce((sum, item) => sum + Math.max(item.reorderLevel - item.stock, 0), 0),
    }),
    [items],
  );

  const restock = async (id: string) => {
    try {
      const updated = await restockItem(id);
      setItems((current) => current.map((item) => (item.id === id ? updated : item)));
      setMessage("Stock item restocked in backend.");
    } catch {
      setItems((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, stock: item.reorderLevel + 6, status: "OK" }
            : item,
        ),
      );
      setMessage("Backend unavailable, stock item restocked locally.");
    }
  };

  const createReorderList = () => {
    const lines = items
      .filter((item) => item.status !== "OK")
      .map((item) => `${item.id} - ${item.part}: reorder ${Math.max(item.reorderLevel - item.stock, 0)} units from ${item.vendor}`)
      .join("\n");
    setReorderNote(lines || "No low stock items.");
    setMessage("Reorder list prepared.");
  };

  return (
    <>
      <PageHeader
        eyebrow="Inventory Desk"
        title="Stock Alerts"
        subtitle="Monitor low stock, critical parts, reorder levels, and vendor-ready purchase notes."
        message={message}
      />

      <div className="mb-6 grid md:grid-cols-4 gap-5">
        <StatCard icon={AlertTriangle} label="Critical" value={summary.critical} hint="Immediate reorder" tone="dark" />
        <StatCard icon={PackageSearch} label="Low Stock" value={summary.low} hint="Below reorder level" tone="amber" />
        <StatCard icon={PackageCheck} label="Healthy" value={summary.healthy} hint="Stock available" />
        <StatCard icon={ShoppingCart} label="Units Needed" value={summary.reorderValue} hint="To meet reorder levels" />
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <DataCard className="xl:col-span-2" title="Parts Stock Watch">
          <div className="mb-5 grid md:grid-cols-[1fr_auto] gap-4 items-end">
            <SelectField
              label="Filter"
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: "All stock" },
                { value: "Critical", label: "Critical only" },
                { value: "Low", label: "Low only" },
                { value: "OK", label: "Healthy only" },
              ]}
            />
            <PrimaryButton type="button" icon={Plus} variant="amber" onClick={createReorderList}>
              Prepare Reorder
            </PrimaryButton>
          </div>

          {filteredItems.length === 0 ? (
            <EmptyState title="No stock alerts" text="Parts matching the selected filter will appear here." />
          ) : (
            <TableShell>
              <TableHead>
                <Th>Part</Th>
                <Th>Stock</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </TableHead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <Td>
                      <div className="font-bold text-[oklch(0.18_0.012_60)]">{item.part}</div>
                      <div className="mt-1 text-xs text-[oklch(0.5_0.012_70)]">{item.id} - {item.category}</div>
                    </Td>
                    <Td>
                      <div className="font-semibold">{item.stock} units</div>
                      <div className="mt-1 text-xs text-[oklch(0.5_0.012_70)]">Reorder at {item.reorderLevel}</div>
                    </Td>
                    <Td>
                      <StatusPill tone={item.status === "Critical" ? "danger" : item.status === "Low" ? "warning" : "success"}>
                        {item.status}
                      </StatusPill>
                    </Td>
                    <Td>
                      <button type="button" onClick={() => restock(item.id)} className="rounded-xl bg-[oklch(0.205_0.012_60)] px-3 py-2 text-xs font-bold text-white transition hover:opacity-90">
                        Restock
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </DataCard>

        <DataCard title="Vendor Reorder Note">
          <div className="space-y-4">
            <DetailRow label="Vendor" value="Axleworks Stock" strong />
            <DetailRow label="Priority" value={summary.critical > 0 ? "Urgent" : "Normal"} strong />
            <Field label="Prepared Note" value={reorderNote} onChange={setReorderNote} required={false} placeholder="Click Prepare Reorder to generate stock note." />
            <div className="rounded-2xl bg-[oklch(0.94_0.01_80)] p-4 text-sm leading-6 text-[oklch(0.42_0.012_70)] whitespace-pre-line">
              {reorderNote || "Low-stock purchase notes will appear here."}
            </div>
          </div>
        </DataCard>
      </div>
    </>
  );
}
