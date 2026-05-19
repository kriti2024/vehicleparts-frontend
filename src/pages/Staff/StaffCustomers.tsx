import { useEffect, useMemo, useState } from "react";
import {
    Car,
    History,
    Save,
    UserPlus,
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
} from "../../components/staff/DashboardParts";

import {
    addVehicle,
    createCustomer,
    getCustomers,
    getCustomerWithVehicles,
} from "../../api/customerApi";

import { getCustomerSales } from "../../api/salesApi";

import type {
    Customer,
    CustomerWithVehicles,
} from "../../types/customer";

import type { Sale } from "../../types/sale";

const getSaleValue = (sale: Sale) =>
    sale.finalAmount ??
    sale.totalAmount ??
    sale.subTotal ??
    0;

const blankCustomer = {
    fullName: "",
    phone: "",
    email: "",
    vehicleNumber: "",
    model: "",
};


export default function StaffCustomers() {
    const [customers, setCustomers] =
        useState<Customer[]>([]);

    const [selectedCustomerId, setSelectedCustomerId] =
        useState("");

    const [selectedCustomer, setSelectedCustomer] =
        useState<CustomerWithVehicles | null>(null);

    const [salesHistory, setSalesHistory] =
        useState<Sale[]>([]);

    const [form, setForm] =
        useState(blankCustomer);

    const [vehicleForm, setVehicleForm] =
        useState({
            vehicleNumber: "",
            model: "",
        });

    const [loading, setLoading] =
        useState(true);

    const [detailsLoading, setDetailsLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const customerOptions = useMemo(
        () =>
            customers.map((customer) => ({
                value: String(customer.customerId),
                label: `${customer.fullName} - ${customer.phone}`,
            })),
        [customers]
    );

    useEffect(() => {
        let cancelled = false;

        const fetchCustomers = async () => {
            try {
                const data = await getCustomers();

                if (!cancelled) {
                    setCustomers(data);
                }
            } catch {
                if (!cancelled) {
                    setError(
                        "Failed to load customers."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchCustomers();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!selectedCustomerId) return;

        let cancelled = false;

        const fetchCustomerDetails = async () => {
            try {
                setDetailsLoading(true);

                const [details, sales] =
                    await Promise.all([
                        getCustomerWithVehicles(
                            Number(selectedCustomerId)
                        ),
                        getCustomerSales(
                            Number(selectedCustomerId)
                        ),
                    ]);

                if (!cancelled) {
                    setSelectedCustomer(details);
                    setSalesHistory(sales);
                    setError("");
                }
            } catch {
                if (!cancelled) {
                    setSelectedCustomer(null);
                    setSalesHistory([]);

                    setError(
                        "Could not load customer details."
                    );
                }
            } finally {
                if (!cancelled) {
                    setDetailsLoading(false);
                }
            }
        };

        fetchCustomerDetails();

        return () => {
            cancelled = true;
        };
    }, [selectedCustomerId]);

    const handleCreateCustomer = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        if (!form.fullName.trim()) {
            setError("Full name is required.");
            return;
        }

        if (!form.phone.trim()) {
            setError("Phone number is required.");
            return;
        }

        if (!form.email.trim()) {
            setError("Email is required.");
            return;
        }



        try {
            setSaving(true);
            setError("");
            setMessage("");

            const customer =
                await createCustomer({
                    fullName: form.fullName.trim(),
                    phone: form.phone.trim(),
                    email: form.email.trim(),
                });

            if (
                form.vehicleNumber &&
                form.model
            ) {
                await addVehicle({
                    customerId:
                        customer.customerId,
                    vehicleNumber:
                        form.vehicleNumber.trim(),
                    model:
                        form.model.trim(),
                });
            }

            setForm(blankCustomer);

            setSelectedCustomerId(
                String(customer.customerId)
            );

            setMessage(
                `Customer "${customer.fullName}" registered successfully.`
            );
        } catch (err: unknown) {
            const axiosErr = err as {
                response?: {
                    data?: {
                        errors?: string[];
                    };
                };
            };

            const backendErrors =
                axiosErr?.response?.data?.errors;

            setError(
                backendErrors?.join(", ") ??
                "Failed to register customer."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleAddVehicle = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        if (!selectedCustomerId) {
            setError(
                "Please select a customer first."
            );
            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            await addVehicle({
                customerId: Number(
                    selectedCustomerId
                ),
                vehicleNumber:
                    vehicleForm.vehicleNumber,
                model: vehicleForm.model,
            });

            setVehicleForm({
                vehicleNumber: "",
                model: "",
            });

            setMessage(
                "Vehicle added successfully."
            );

            const updatedDetails =
                await getCustomerWithVehicles(
                    Number(selectedCustomerId)
                );

            setSelectedCustomer(updatedDetails);
        } catch {
            setError(
                "Failed to add vehicle."
            );
        } finally {
            setSaving(false);
        }
    };

    const totalSpent =
        salesHistory.reduce(
            (sum, sale) =>
                sum + getSaleValue(sale),
            0
        );

    return (
        <>
            <PageHeader
                eyebrow="Staff Customers"
                title="Customers & Vehicles"
                subtitle="Register customers, manage vehicle records, and view customer purchase history."
                message={message}
            />

            {error && (
                <InlineAlert>
                    {error}
                </InlineAlert>
            )}

            <div className="mb-6 grid md:grid-cols-4 gap-5">
                <StatCard
                    icon={UserPlus}
                    label="Customers"
                    value={
                        loading
                            ? "..."
                            : customers.length
                    }
                    hint="Registered customer records"
                    tone="dark"
                />

                <StatCard
                    icon={Car}
                    label="Vehicles"
                    value={
                        selectedCustomer?.vehicles
                            .length ?? 0
                    }
                    hint="Customer vehicle records"
                    tone="amber"
                />

                <StatCard
                    icon={History}
                    label="Purchase History"
                    value={salesHistory.length}
                    hint={`Rs. ${totalSpent} total purchases`}
                />

                <StatCard
                    icon={Save}
                    label="Records"
                    value="Ready"
                    hint="Customer data management"
                />
            </div>

            <div className="grid xl:grid-cols-2 gap-6 mb-6">
                <DataCard title="Register Customer">
                    <form
                        onSubmit={handleCreateCustomer}
                        className="grid md:grid-cols-2 gap-5"
                    >
                        <Field
                            label="Full Name"
                            value={form.fullName}
                            onChange={(value) =>
                                setForm({
                                    ...form,
                                    fullName: value,
                                })
                            }
                            placeholder="Customer name"
                        />

                        <Field
                            label="Phone"
                            value={form.phone}
                            onChange={(value) =>
                                setForm({
                                    ...form,
                                    phone: value,
                                })
                            }
                            placeholder="Phone number"
                        />

                        <Field
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={(value) =>
                                setForm({
                                    ...form,
                                    email: value,
                                })
                            }
                            placeholder="customer@email.com"
                        />


                        <Field
                            label="Vehicle Number"
                            value={form.vehicleNumber}
                            onChange={(value) =>
                                setForm({
                                    ...form,
                                    vehicleNumber: value,
                                })
                            }
                            placeholder="Vehicle number"
                        />

                        <Field
                            label="Vehicle Model"
                            value={form.model}
                            onChange={(value) =>
                                setForm({
                                    ...form,
                                    model: value,
                                })
                            }
                            placeholder="Vehicle model"
                        />

                        <div className="flex items-end">
                            <PrimaryButton
                                icon={Save}
                                disabled={saving}
                                variant="solid"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Customer"}
                            </PrimaryButton>
                        </div>
                    </form>
                </DataCard>

                <DataCard title="Customer Details & Add Vehicle">
                    <div className="space-y-5">
                        <SelectField
                            label="Select Customer"
                            value={selectedCustomerId}
                            options={customerOptions}
                            onChange={setSelectedCustomerId}
                            placeholder={
                                loading
                                    ? "Loading customers..."
                                    : "Select customer"
                            }
                        />

                        <form
                            onSubmit={handleAddVehicle}
                            className="grid md:grid-cols-2 gap-5"
                        >
                            <Field
                                label="Vehicle Number"
                                value={
                                    vehicleForm.vehicleNumber
                                }
                                onChange={(value) =>
                                    setVehicleForm({
                                        ...vehicleForm,
                                        vehicleNumber: value,
                                    })
                                }
                                placeholder="Vehicle number"
                            />

                            <Field
                                label="Model"
                                value={vehicleForm.model}
                                onChange={(value) =>
                                    setVehicleForm({
                                        ...vehicleForm,
                                        model: value,
                                    })
                                }
                                placeholder="Vehicle model"
                            />

                            <div className="md:col-span-2">
                                <PrimaryButton
                                    icon={Car}
                                    disabled={saving}
                                    variant="amber"
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Add Vehicle"}
                                </PrimaryButton>
                            </div>
                        </form>

                        {detailsLoading ? (
                            <p className="text-sm text-[oklch(0.5_0.012_70)]">
                                Loading customer details...
                            </p>
                        ) : selectedCustomer ? (
                            <div className="space-y-3">
                                <DetailRow
                                    label="Name"
                                    value={
                                        selectedCustomer.fullName
                                    }
                                    strong
                                />

                                <DetailRow
                                    label="Phone"
                                    value={
                                        selectedCustomer.phone
                                    }
                                />

                                <DetailRow
                                    label="Email"
                                    value={
                                        selectedCustomer.email ||
                                        "-"
                                    }
                                />
                            </div>
                        ) : (
                            <EmptyState
                                title="No customer selected"
                                text="Select a customer to view details."
                            />
                        )}
                    </div>
                </DataCard>
            </div>
        </>
    );
}