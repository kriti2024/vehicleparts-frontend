import { useEffect, useMemo, useState } from "react";
import {
    CreditCard,
    FileText,
    Plus,
    Send,
    ShoppingCart,
    Trash2,
} from "lucide-react";

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
    TableHead,
    TableShell,
    Td,
    Th,
} from "../../components/staff/DashboardParts";

import { getCustomers } from "../../api/customerApi";
import { getParts } from "../../api/partsApi";
import { createSale } from "../../api/salesApi";

import type { Customer } from "../../types/customer";
import type { Sale, SaleItemRequest } from "../../types/sale";
import type { PartOption } from "../../api/partsApi";

export default function StaffSales() {
    const [customers, setCustomers] =
        useState<Customer[]>([]);

    const [parts, setParts] =
        useState<PartOption[]>([]);

    const [customerId, setCustomerId] =
        useState("");

    const [partId, setPartId] =
        useState("");

    const [quantity, setQuantity] =
        useState("1");

    const [items, setItems] =
        useState<SaleItemRequest[]>([]);

    const [paymentMethod, setPaymentMethod] =
        useState("Cash");

    const [createdSale, setCreatedSale] =
        useState<Sale | null>(null);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    useEffect(() => {
        const loadData = async () => {
            try {

                const [
                    customerData,
                    partData,
                ] = await Promise.all([
                    getCustomers(),
                    getParts(),
                ]);

                setCustomers(customerData);
                setParts(partData);
            } catch {
                setError(
                    "Failed to load customers or parts."
                );
            } 
        };

        loadData();
    }, []);

    const customerOptions = useMemo(
        () => [
            { value: "", label: "Select a customer..." },
            ...customers.map((c) => ({
                value: String(c.customerId),
                label: `${c.fullName} - ${c.phone}`,
            }))
        ],
        [customers]
    );

    const partOptions = useMemo(
        () => [
            { value: "", label: "Select a part..." },
            ...parts.map((p) => ({
                value: String(p.partId),
                label: `${p.partName} - Rs.${p.price}`,
            }))
        ],
        [parts]
    );

    const handleAddItem = () => {
        if (!partId) {
            setError("Select a part.");
            return;
        }

        setItems((current) => [
            ...current,
            {
                partId: Number(partId),
                quantity: Number(quantity),
            },
        ]);

        setPartId("");
        setQuantity("1");
        setError("");
    };

    const handleCreateSale = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        if (!customerId) {
            setError("Select customer.");
            return;
        }

        if (items.length === 0) {
            setError("Add sale items.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const sale = await createSale({
                customerId: Number(customerId),
                items,
            });

            setCreatedSale(sale);

            setItems([]);

            setMessage(
                `Sale #${sale.saleId} created successfully.`
            );
        } catch {
            setError("Failed to create sale.");
        } finally {
            setSaving(false);
        }
    };

    const getPartName = (
        partId: number
    ) => {
        const part = parts.find(
            (p) => p.partId === partId
        );

        return part?.partName || "Part";
    };

    return (
        <>
            <PageHeader
                eyebrow="Sales"
                title="Create Sale"
                subtitle="Sell vehicle parts and generate invoices."
                message={message}
            />

            {error && (
                <InlineAlert>
                    {error}
                </InlineAlert>
            )}

            <div className="mb-6 grid md:grid-cols-4 gap-5">
                <StatCard
                    icon={ShoppingCart}
                    label="Items"
                    value={items.length}
                />

                <StatCard
                    icon={FileText}
                    label="Invoice"
                    value={
                        createdSale
                            ? `#${createdSale.saleId}`
                            : "Pending"
                    }
                />

                <StatCard
                    icon={CreditCard}
                    label="Payment"
                    value={paymentMethod}
                />

                <StatCard
                    icon={Send}
                    label="Customer"
                    value={
                        customerId
                            ? "Selected"
                            : "Not Selected"
                    }
                />
            </div>

            <div className="grid xl:grid-cols-2 gap-6">
                <DataCard title="Sale Form">
                    <form
                        onSubmit={handleCreateSale}
                        className="space-y-5"
                    >
                        <SelectField
                            label="Customer"
                            value={customerId}
                            onChange={setCustomerId}
                            options={customerOptions}
                        />

                        <div className="grid md:grid-cols-[1fr_120px_auto] gap-4 items-end">
                            <SelectField
                                label="Part"
                                value={partId}
                                onChange={setPartId}
                                options={partOptions}
                            />

                            <Field
                                label="Quantity"
                                type="number"
                                value={quantity}
                                onChange={setQuantity}
                            />

                            <PrimaryButton
                                type="button"
                                icon={Plus}
                                variant="amber"
                                onClick={handleAddItem}
                            >
                                Add
                            </PrimaryButton>
                        </div>

                        <SelectField
                            label="Payment Method"
                            value={paymentMethod}
                            onChange={setPaymentMethod}
                            options={[
                                {
                                    value: "Cash",
                                    label: "Cash",
                                },
                                {
                                    value: "Card",
                                    label: "Card",
                                },
                                {
                                    value: "eSewa",
                                    label: "eSewa",
                                },
                                {
                                    value: "Credit",
                                    label: "Credit",
                                },
                            ]}
                        />

                        {items.length === 0 ? (
                            <EmptyState
                                title="No items"
                                text="Add parts to create sale."
                            />
                        ) : (
                            <TableShell>
                                <TableHead>
                                    <Th>Part</Th>
                                    <Th>Qty</Th>
                                    <Th>Action</Th>
                                </TableHead>

                                <tbody>
                                    {items.map(
                                        (item, index) => (
                                            <tr key={index}>
                                                <Td>
                                                    {getPartName(
                                                        item.partId
                                                    )}
                                                </Td>

                                                <Td>
                                                    {item.quantity}
                                                </Td>

                                                <Td>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setItems(
                                                                current =>
                                                                    current.filter(
                                                                        (_, i) =>
                                                                            i !== index
                                                                    )
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </Td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </TableShell>
                        )}

                        <PrimaryButton
                            disabled={saving}
                            icon={ShoppingCart}
                        >
                            {saving
                                ? "Creating..."
                                : "Create Sale"}
                        </PrimaryButton>
                    </form>
                </DataCard>

                <DataCard title="Sale Summary">
                    {!createdSale ? (
                        <EmptyState
                            title="No sale created"
                            text="Created sale will appear here."
                        />
                    ) : (
                        <div className="space-y-4">
                            <DetailRow
                                label="Sale ID"
                                value={`#${createdSale.saleId}`}
                                strong
                            />

                            <DetailRow
                                label="Customer"
                                value={
                                    createdSale.customerName
                                }
                            />

                            <DetailRow
                                label="Sub Total"
                                value={`Rs. ${createdSale.subTotal}`}
                            />

                            <DetailRow
                                label="Discount"
                                value={`Rs. ${createdSale.discountAmount}`}
                            />

                            <DetailRow
                                label="Final Amount"
                                value={`Rs. ${createdSale.finalAmount}`}
                                strong
                            />

                            <PrimaryButton
                                type="button"
                                icon={FileText}
                                variant="outline"
                                onClick={() =>
                                    window.location.assign(
                                        `/staff/invoices?saleId=${createdSale.saleId}`
                                    )
                                }
                            >
                                Open Invoice
                            </PrimaryButton>
                        </div>
                    )}
                </DataCard>
            </div>
        </>
    );
}