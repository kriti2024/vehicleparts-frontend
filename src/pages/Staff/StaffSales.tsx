import { useEffect, useMemo, useState } from "react";
import { CreditCard, FileText, Plus, ReceiptText, Send, ShoppingCart, Trash2 } from "lucide-react";

import {
  DataCard,
  DetailRow,
  EmptyState,
  Field,
  InlineAlert,
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
import { getCustomers } from "../../api/customerApi";
import { getParts, type PartOption } from "../../api/partsApi";
import { createSale } from "../../api/salesApi";
import type { Customer } from "../../types/customer";
import type { Sale, SaleItemRequest } from "../../types/sale";

const getSaleTotal = (sale: Sale) => sale.totalAmount ?? sale.subTotal ?? 0;
const getSaleFinal = (sale: Sale) => sale.finalAmount ?? sale.totalAmount ?? sale.subTotal ?? 0;

export default function StaffSales() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [parts, setParts] = useState<PartOption[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [selectedPartId, setSelectedPartId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [items, setItems] = useState<SaleItemRequest[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [saleNote, setSaleNote] = useState("");
  const [createdSale, setCreatedSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const [customerData, partData] = await Promise.all([
          getCustomers(),
          getParts(),
        ]);
        setCustomers(customerData);
        setParts(partData);
      } catch {
        setError(
          "Failed to load data. Make sure the backend server is running on http://localhost:5298."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const customerOptions = useMemo(
    () =>
      customers.map((c) => ({
        value: String(c.customerId),
        label: `${c.fullName} - ${c.phone}`,
      })),
    [customers]
  );

  const partOptions = useMemo(
    () =>
      parts.map((p) => ({
        value: String(p.partId),
        label: `#${p.partId} - ${p.partName} - Rs.${p.price} (Stock: ${p.stockQuantity})`,
      })),
    [parts]
  );

  const selectedCustomer = customers.find(
    (c) => String(c.customerId) === customerId
  );

  const selectedPart = parts.find((p) => String(p.partId) === selectedPartId);

  const handleAddItem = () => {
    if (!selectedPartId || !quantity || Number(quantity) < 1) {
      setError("Select a part and enter a valid quantity before adding.");
      return;
    }
    const part = parts.find((p) => String(p.partId) === selectedPartId);
    if (part && Number(quantity) > part.stockQuantity) {
      setError(
        `Insufficient stock for ${part.partName}. Available: ${part.stockQuantity}`
      );
      return;
    }
    setError("");
    setItems((current) => [
      ...current,
      { partId: Number(selectedPartId), quantity: Number(quantity) },
    ]);
    setSelectedPartId("");
    setQuantity("1");
  };

  const handleCreateSale = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!customerId) {
      setError("Please select a customer.");
      return;
    }
    if (items.length === 0) {
      setError("Add at least one part before creating a sale.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");
      setCreatedSale(null);

      const sale = await createSale({
        customerId: Number(customerId),
        items,
      });

      setCreatedSale(sale);
      setItems([]);
      setMessage(
        `Sale #${sale.saleId} created successfully. Rs. ${getSaleFinal(sale)} - invoice ready.`
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Unknown error occurred.";
      setError(`Failed to create sale: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const emailHref = createdSale
    ? `mailto:${selectedCustomer?.email ?? ""}?subject=${encodeURIComponent(`Invoice for sale #${createdSale.saleId}`)}&body=${encodeURIComponent(
        `Dear ${selectedCustomer?.fullName ?? "Customer"},\n\nYour sales invoice is ready.\nSale ID: ${createdSale.saleId}\nPayment: ${paymentStatus} via ${paymentMethod}\nFinal Amount: Rs. ${getSaleFinal(createdSale)}\n\nThank you.`
      )}`
    : "";

  const getPartName = (partId: number) => {
    const part = parts.find((p) => p.partId === partId);
    return part ? part.partName : `Part #${partId}`;
  };

  return (
    <>
      <PageHeader
        eyebrow="Parts Counter"
        title="New Sale"
        subtitle="Sell vehicle parts, add multiple line items, and generate an invoice-ready sale for the customer."
        message={message}
      />

      {error && <InlineAlert>{error}</InlineAlert>}

      <div className="mb-6 grid md:grid-cols-4 gap-5">
        <StatCard icon={ShoppingCart} label="Items" value={items.length} hint="Prepared for sale" tone="dark" />
        <StatCard icon={FileText} label="Invoice" value={createdSale ? `#${createdSale.saleId}` : "Pending"} hint="Generated after sale" tone="amber" />
        <StatCard icon={CreditCard} label="Payment" value={paymentStatus} hint={paymentMethod} />
        <StatCard icon={Send} label="Email" value={selectedCustomer?.email ? "Ready" : "Needs Email"} hint="Invoice email action" />
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <DataCard title="Create Sale">
          <form onSubmit={handleCreateSale} className="space-y-5">

            {/* Customer Select */}
            <SelectField
              label="Select Customer"
              value={customerId}
              options={customerOptions}
              onChange={setCustomerId}
              placeholder={loading ? "Loading customers..." : customers.length === 0 ? "No customers found - register one first" : "Select customer"}
            />

            {/* Part + Quantity row */}
            <div className="grid md:grid-cols-[1fr_120px_auto] gap-4 items-end">
              <SelectField
                label="Select Part"
                value={selectedPartId}
                options={partOptions}
                onChange={setSelectedPartId}
                placeholder={loading ? "Loading parts..." : parts.length === 0 ? "No parts in stock" : "Select part"}
              />
              <Field
                label="Qty"
                type="number"
                value={quantity}
                onChange={setQuantity}
                placeholder="1"
              />
              <PrimaryButton type="button" icon={Plus} variant="amber" onClick={handleAddItem}>
                Add
              </PrimaryButton>
            </div>

            {/* Show selected part price info */}
            {selectedPart && (
              <p className="text-xs text-[oklch(0.42_0.05_65)] font-semibold">
                Unit price: Rs. {selectedPart.price} - Stock: {selectedPart.stockQuantity}
              </p>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              <SelectField
                label="Payment Method"
                value={paymentMethod}
                onChange={setPaymentMethod}
                options={[
                  { value: "Cash", label: "Cash" },
                  { value: "Card", label: "Card" },
                  { value: "eSewa", label: "eSewa" },
                  { value: "Credit", label: "Credit" },
                ]}
              />
              <SelectField
                label="Payment Status"
                value={paymentStatus}
                onChange={setPaymentStatus}
                options={[
                  { value: "Paid", label: "Paid" },
                  { value: "Partial", label: "Partial" },
                  { value: "Credit due", label: "Credit due" },
                ]}
              />
              <Field
                label="Sale Note"
                value={saleNote}
                onChange={setSaleNote}
                required={false}
                placeholder="Optional note"
              />
            </div>

            {/* Cart */}
            {items.length === 0 ? (
              <EmptyState title="No parts added" text="Select a part and quantity above, then click Add." />
            ) : (
              <TableShell>
                <TableHead>
                  <Th>Part</Th>
                  <Th>Qty</Th>
                  <Th>Action</Th>
                </TableHead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={`${item.partId}-${index}`}>
                      <Td className="font-semibold">{getPartName(item.partId)}</Td>
                      <Td>{item.quantity}</Td>
                      <Td>
                        <button
                          type="button"
                          onClick={() =>
                            setItems((current) =>
                              current.filter((_, i) => i !== index)
                            )
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100"
                          aria-label="Remove item"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </TableShell>
            )}

            <PrimaryButton disabled={saving || loading} icon={ShoppingCart}>
              {saving ? "Creating..." : "Create Sale"}
            </PrimaryButton>
          </form>
        </DataCard>

        <DataCard title="Generated Sale & Invoice Prep">
          {!createdSale ? (
            <EmptyState title="No sale generated" text="Created sale totals and invoice actions will appear here." />
          ) : (
            <div className="space-y-4">
              <div className="rounded-3xl bg-[oklch(0.18_0.012_60)] p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.28em] opacity-70">Sale ID</div>
                    <div className="mt-2 text-3xl font-bold">#{createdSale.saleId}</div>
                  </div>
                  <StatusPill tone="warning">Invoice Ready</StatusPill>
                </div>
              </div>

              <DetailRow label="Customer" value={createdSale.customerName || selectedCustomer?.fullName || customerId} strong />
              <DetailRow label="Total Amount" value={`Rs. ${getSaleTotal(createdSale)}`} />
              <DetailRow label="Discount" value={`Rs. ${createdSale.discountAmount ?? 0}`} />
              <DetailRow label="Final Amount" value={`Rs. ${getSaleFinal(createdSale)}`} strong />
              <DetailRow label="Payment" value={`${paymentStatus} - ${paymentMethod}`} strong />
              {saleNote && <DetailRow label="Note" value={saleNote} />}

              <div className="flex flex-wrap gap-3 pt-2">
                <PrimaryButton
                  type="button"
                  icon={FileText}
                  variant="outline"
                  onClick={() => window.location.assign(`/staff/invoices?saleId=${createdSale.saleId}`)}
                >
                  Open Invoice
                </PrimaryButton>
                <PrimaryButton
                  type="button"
                  icon={ReceiptText}
                  variant="outline"
                  onClick={() => navigator.clipboard?.writeText(String(createdSale.saleId))}
                >
                  Copy Sale ID
                </PrimaryButton>
                {selectedCustomer?.email && (
                  <a
                    href={emailHref}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[oklch(0.74_0.16_65)] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[oklch(0.18_0.012_60)] transition hover:opacity-90"
                  >
                    <Send className="h-4 w-4" />
                    Email Invoice
                  </a>
                )}
              </div>
            </div>
          )}
        </DataCard>
      </div>
    </>
  );
}
