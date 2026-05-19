import { useState } from "react";
import { Search, Send } from "lucide-react";

import {
    DataCard,
    DetailRow,
    EmptyState,
    Field,
    InlineAlert,
    PageHeader,
    PrimaryButton,
} from "../../components/staff/DashboardParts";

import { getInvoiceBySaleId } from "../../api/invoiceApi";
import type { Invoice } from "../../types/invoice";

export default function StaffInvoices() {
    const [saleId, setSaleId] = useState("");
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const searchInvoice = async () => {
        if (!saleId.trim()) {
            setError("Enter sale ID.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await getInvoiceBySaleId(Number(saleId));
            setInvoice(data);
        } catch {
            setError("Invoice not found.");
            setInvoice(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageHeader
                eyebrow="Staff"
                title="Sales Invoices"
                subtitle="Search and send customer invoices."
            />

            {error && <InlineAlert>{error}</InlineAlert>}

            <div className="grid lg:grid-cols-3 gap-6">

                <DataCard title="Search Invoice">
                    <div className="space-y-4">
                        <Field
                            label="Sale ID"
                            value={saleId}
                            onChange={setSaleId}
                            type="number"
                            placeholder="Enter sale ID"
                        />

                        <PrimaryButton
                            icon={Search}
                            onClick={searchInvoice}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Search"}
                        </PrimaryButton>
                    </div>
                </DataCard>

                <DataCard
                    className="lg:col-span-2"
                    title="Invoice Details"
                >
                    {!invoice ? (
                        <EmptyState
                            title="No invoice"
                            text="Search sale invoice using sale ID."
                        />
                    ) : (
                        <div className="space-y-4">

                            <DetailRow
                                label="Invoice Number"
                                value={invoice.invoiceNumber || "-"}
                                strong
                            />

                            <DetailRow
                                label="Sale ID"
                                value={String(invoice.saleId || "-")}
                            />

                            <DetailRow
                                label="Customer"
                                value={invoice.customerName || "-"}
                            />

                            <DetailRow
                                label="Subtotal"
                                value={`Rs. ${invoice.subTotal || 0}`}
                            />

                            <DetailRow
                                label="Discount"
                                value={`Rs. ${invoice.discountAmount || 0}`}
                            />

                            <DetailRow
                                label="Final Amount"
                                value={`Rs. ${invoice.finalAmount || 0}`}
                                strong
                            />

                            <PrimaryButton
                                icon={Send}
                                onClick={() =>
                                    window.open(
                                        `mailto:?subject=Invoice ${invoice.invoiceNumber}`
                                    )
                                }
                            >
                                Send Email
                            </PrimaryButton>

                        </div>
                    )}
                </DataCard>

            </div>
        </>
    );
}