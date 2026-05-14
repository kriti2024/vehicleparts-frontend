import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Copy, Download, FileText, Printer, Search, Send } from "lucide-react";

import {
  DataCard,
  DetailRow,
  EmptyState,
  Field,
  InlineAlert,
  PageHeader,
  PrimaryButton,
  StatCard,
  StatusPill,
} from "../../components/staff/DashboardParts";
import { getInvoiceBySaleId } from "../../api/invoiceApi";
import type { Invoice } from "../../types/invoice";

const getInvoiceTotal = (invoice: Invoice) => invoice.totalAmount ?? invoice.subTotal ?? 0;
const getInvoiceFinal = (invoice: Invoice) => invoice.finalAmount ?? invoice.totalAmount ?? invoice.subTotal ?? 0;
const getInvoiceDate = (invoice: Invoice) => invoice.createdAt ?? invoice.invoiceDate;

export default function StaffInvoices() {
  const [searchParams] = useSearchParams();
  const [saleId, setSaleId] = useState(searchParams.get("saleId") ?? "");
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSearchInvoice = async (event?: React.FormEvent) => {
    event?.preventDefault();

    if (!saleId.trim()) {
      setError("Please enter sale ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setInvoice(null);

      const data = await getInvoiceBySaleId(Number(saleId));
      setInvoice(data);
      setMessage("Invoice loaded. Add customer email to prepare the send action.");
    } catch {
      setError("Invoice not found or backend is not running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialSaleId = searchParams.get("saleId");
    if (!initialSaleId) return;

    let cancelled = false;

    const fetchInvoice = async () => {
      try {
        const data = await getInvoiceBySaleId(Number(initialSaleId));
        if (!cancelled) {
          setInvoice(data);
          setMessage("Invoice loaded. Add customer email to prepare the send action.");
        }
      } catch {
        if (!cancelled) {
          setError("Invoice not found or backend is not running.");
        }
      }
    };

    fetchInvoice();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const emailHref = invoice
    ? `mailto:${customerEmail}?subject=${encodeURIComponent(`Invoice ${invoice.invoiceNumber || `sale #${invoice.saleId || saleId}`}`)}&body=${encodeURIComponent(
        `Dear ${invoice.customerName || "Customer"},\n\nYour invoice is ready.\nInvoice: ${invoice.invoiceNumber || "-"}\nSale ID: ${invoice.saleId || saleId}\nTotal: Rs. ${getInvoiceTotal(invoice)}\nDiscount: Rs. ${invoice.discountAmount ?? 0}\nFinal Amount: Rs. ${getInvoiceFinal(invoice)}\n\nThank you.`,
      )}`
    : "";

  const invoiceText = invoice
    ? [
        `Invoice: ${invoice.invoiceNumber || "-"}`,
        `Sale ID: ${invoice.saleId || saleId}`,
        `Customer: ${invoice.customerName || "-"}`,
        `Created: ${getInvoiceDate(invoice) ? new Date(getInvoiceDate(invoice)!).toLocaleString() : "-"}`,
        `Total: Rs. ${getInvoiceTotal(invoice)}`,
        `Discount: Rs. ${invoice.discountAmount ?? 0}`,
        `Final Amount: Rs. ${getInvoiceFinal(invoice)}`,
      ].join("\n")
    : "";

  const handleCopyInvoice = async () => {
    if (!invoiceText) return;
    await navigator.clipboard?.writeText(invoiceText);
    setMessage("Invoice details copied.");
  };

  const handleDownloadInvoice = () => {
    if (!invoiceText) return;

    const blob = new Blob([invoiceText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice?.invoiceNumber || `sale-${saleId}`}-invoice.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Invoice text file downloaded.");
  };

  return (
    <>
      <PageHeader
        eyebrow="Billing Desk"
        title="Invoices"
        subtitle="Search generated invoices by sale ID, review totals, and prepare a customer email."
        message={message}
      />

      {error && <InlineAlert>{error}</InlineAlert>}

      <div className="mb-6 grid md:grid-cols-3 gap-5">
        <StatCard icon={FileText} label="Invoice" value={invoice?.invoiceNumber || "Search"} hint="Generated from sale" tone="dark" />
        <StatCard icon={Search} label="Sale ID" value={invoice?.saleId || saleId || "-"} hint="Lookup key" tone="amber" />
        <StatCard icon={Send} label="Email" value={customerEmail ? "Ready" : "Pending"} hint="Opens customer mail draft" />
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <DataCard className="xl:col-span-1" title="Find Invoice">
          <form onSubmit={handleSearchInvoice} className="space-y-5">
            <Field label="Sale ID" value={saleId} onChange={setSaleId} type="number" placeholder="Enter sale ID" />
            <PrimaryButton disabled={loading} icon={Search}>
              {loading ? "Loading..." : "Search Invoice"}
            </PrimaryButton>
          </form>
        </DataCard>

        <DataCard className="xl:col-span-2" title="Invoice Preview">
          {!invoice ? (
            <EmptyState title="No invoice selected" text="Enter a sale ID to view invoice details." />
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4 rounded-3xl bg-[oklch(0.18_0.012_60)] p-6 text-white">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.28em] opacity-70">Invoice</div>
                  <div className="mt-2 text-3xl font-bold">{invoice.invoiceNumber || "-"}</div>
                  <div className="mt-2 text-sm opacity-70">Sale ID: {invoice.saleId || saleId}</div>
                </div>
                <StatusPill tone="warning">Generated</StatusPill>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <DetailRow label="Customer" value={invoice.customerName || "-"} strong />
                <DetailRow label="Created" value={getInvoiceDate(invoice) ? new Date(getInvoiceDate(invoice)!).toLocaleString() : "-"} />
                <DetailRow label="Total Amount" value={`Rs. ${getInvoiceTotal(invoice)}`} />
                <DetailRow label="Discount" value={`Rs. ${invoice.discountAmount ?? 0}`} />
                <DetailRow label="Final Amount" value={`Rs. ${getInvoiceFinal(invoice)}`} strong />
              </div>

              <div className="grid md:grid-cols-[1fr_auto] gap-4 items-end rounded-3xl bg-[oklch(0.94_0.01_80)] p-5">
                <Field
                  label="Customer Email"
                  value={customerEmail}
                  onChange={setCustomerEmail}
                  type="email"
                  required={false}
                  placeholder="customer@email.com"
                />
                <a
                  href={emailHref}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[oklch(0.74_0.16_65)] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[oklch(0.18_0.012_60)] transition hover:opacity-90"
                >
                  <Send className="h-4 w-4" />
                  Email Invoice
                </a>
              </div>

              <div className="flex flex-wrap gap-3">
                <PrimaryButton type="button" icon={Copy} variant="outline" onClick={handleCopyInvoice}>
                  Copy Details
                </PrimaryButton>
                <PrimaryButton type="button" icon={Download} variant="outline" onClick={handleDownloadInvoice}>
                  Download TXT
                </PrimaryButton>
                <PrimaryButton type="button" icon={Printer} variant="outline" onClick={() => window.print()}>
                  Print Invoice
                </PrimaryButton>
              </div>
            </div>
          )}
        </DataCard>
      </div>
    </>
  );
}
