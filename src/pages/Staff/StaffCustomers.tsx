import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Car, History, PhoneCall, Save, StickyNote, UserPlus } from "lucide-react";

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
  TextArea,
  Th,
} from "../../components/staff/DashboardParts";
import {
  addVehicle,
  createCustomer,
  getCustomers,
  getCustomerWithVehicles,
} from "../../api/customerApi";
import { getCustomerSales } from "../../api/salesApi";
import type { Customer, CustomerWithVehicles } from "../../types/customer";
import type { Sale } from "../../types/sale";

const getSaleValue = (sale: Sale) => sale.finalAmount ?? sale.totalAmount ?? sale.subTotal ?? 0;

const blankCustomer = {
  fullName: "",
  phone: "",
  email: "",
  vehicleNumber: "",
  model: "",
};

type FollowUp = {
  id: string;
  customerName: string;
  date: string;
  type: string;
  note: string;
};

export default function StaffCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithVehicles | null>(null);
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [form, setForm] = useState(blankCustomer);
  const [vehicleForm, setVehicleForm] = useState({ vehicleNumber: "", model: "" });
  const [followUpForm, setFollowUpForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: "Service reminder",
    note: "",
  });
  const [customerNotes, setCustomerNotes] = useState("");
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const customerOptions = useMemo(
    () =>
      customers.map((customer) => ({
        value: String(customer.customerId),
        label: `${customer.fullName} - ${customer.phone}`,
      })),
    [customers],
  );

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");
      setCustomers(await getCustomers());
    } catch {
      setError("Failed to load customers. Backend may not be running.");
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerDetails = async (customerId: string) => {
    if (!customerId) {
      setSelectedCustomer(null);
      setSalesHistory([]);
      return;
    }

    try {
      setDetailsLoading(true);
      setError("");
      const [details, sales] = await Promise.all([
        getCustomerWithVehicles(Number(customerId)),
        getCustomerSales(Number(customerId)),
      ]);
      setSelectedCustomer(details);
      setSalesHistory(sales);
    } catch {
      setSelectedCustomer(null);
      setSalesHistory([]);
      setError("Could not load customer vehicle details or sale history.");
    } finally {
      setDetailsLoading(false);
    }
  };

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
          setError("Failed to load customers. Backend may not be running.");
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
        const [details, sales] = await Promise.all([
          getCustomerWithVehicles(Number(selectedCustomerId)),
          getCustomerSales(Number(selectedCustomerId)),
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
          setError("Could not load customer vehicle details or sale history.");
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

  const handleCreateCustomer = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!form.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const customer = await createCustomer({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
      });

      if (form.vehicleNumber && form.model) {
        await addVehicle({
          customerId: customer.customerId,
          vehicleNumber: form.vehicleNumber.trim(),
          model: form.model.trim(),
        });
      }

      setForm(blankCustomer);
      setDetailsLoading(true);
      setSelectedCustomerId(String(customer.customerId));
      setMessage(`Customer "${customer.fullName}" registered successfully!`);
      await loadCustomers();
    } catch (err: unknown) {
      // Show the real backend error message so staff know what went wrong
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      const backendMsg = axiosErr?.response?.data?.message;
      const fallback = axiosErr?.message ?? "Unknown error";
      setError(`Failed to register customer: ${backendMsg ?? fallback}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAddVehicle = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedCustomerId) {
      setError("Please select a customer first.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await addVehicle({
        customerId: Number(selectedCustomerId),
        vehicleNumber: vehicleForm.vehicleNumber,
        model: vehicleForm.model,
      });

      setVehicleForm({ vehicleNumber: "", model: "" });
      setMessage("Vehicle added to the customer profile.");
      await loadCustomerDetails(selectedCustomerId);
    } catch {
      setError("Failed to add vehicle.");
    } finally {
      setSaving(false);
    }
  };

  const totalSpent = salesHistory.reduce(
    (sum, sale) => sum + getSaleValue(sale),
    0,
  );

  const handleCreateFollowUp = (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedCustomer) {
      setError("Select a customer before creating a follow-up.");
      return;
    }

    setFollowUps((current) => [
      {
        id: `follow-up-${Date.now()}`,
        customerName: selectedCustomer.fullName,
        date: followUpForm.date,
        type: followUpForm.type,
        note: followUpForm.note || "No extra note.",
      },
      ...current,
    ]);
    setFollowUpForm({
      date: new Date().toISOString().slice(0, 10),
      type: "Service reminder",
      note: "",
    });
    setMessage("Follow-up reminder added for staff.");
    setError("");
  };

  return (
    <>
      <PageHeader
        eyebrow="Staff Customers"
        title="Customers & Vehicles"
        subtitle="Register new customers, attach vehicle records, and view customer history from the same staff workspace."
        message={message}
      />

      {error && <InlineAlert>{error}</InlineAlert>}

      <div className="mb-6 grid md:grid-cols-4 gap-5">
        <StatCard icon={UserPlus} label="Customers" value={loading ? "..." : customers.length} hint="Registered profiles" tone="dark" />
        <StatCard icon={Car} label="Vehicles" value={selectedCustomer?.vehicles.length ?? 0} hint="For selected customer" tone="amber" />
        <StatCard icon={History} label="History" value={salesHistory.length} hint={`Rs. ${totalSpent} total spend`} />
        <StatCard icon={CalendarDays} label="Follow-Ups" value={followUps.length} hint="Staff reminders" />
      </div>

      <div className="grid xl:grid-cols-2 gap-6 mb-6">
        <DataCard title="Register Customer With Vehicle">
          <form onSubmit={handleCreateCustomer} className="grid md:grid-cols-2 gap-5">
            <Field label="Full Name" value={form.fullName} onChange={(value) => setForm({ ...form, fullName: value })} placeholder="Enter customer name" />
            <Field label="Phone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} placeholder="Enter phone number" />
            <Field label="Email" type="email" required={false} value={form.email} onChange={(value) => setForm({ ...form, email: value })} placeholder="customer@email.com" />
            <Field label="Vehicle Number" value={form.vehicleNumber} onChange={(value) => setForm({ ...form, vehicleNumber: value })} placeholder="BA 12 PA 1234" />
            <Field label="Vehicle Model" value={form.model} onChange={(value) => setForm({ ...form, model: value })} placeholder="Toyota Corolla" />
            <div className="flex items-end">
              <PrimaryButton icon={Save} disabled={saving} variant="solid">
                {saving ? "Saving..." : "Save Customer"}
              </PrimaryButton>
            </div>
          </form>
        </DataCard>

        <DataCard title="Customer Detail & Add Vehicle">
          <div className="space-y-5">
            <SelectField
              label="Select Customer"
              value={selectedCustomerId}
              options={customerOptions}
              onChange={(value) => {
                setDetailsLoading(Boolean(value));
                setSelectedCustomerId(value);
              }}
              placeholder={loading ? "Loading customers..." : "Select customer"}
            />

            <form onSubmit={handleAddVehicle} className="grid md:grid-cols-2 gap-5">
              <Field label="Vehicle Number" value={vehicleForm.vehicleNumber} onChange={(value) => setVehicleForm({ ...vehicleForm, vehicleNumber: value })} placeholder="Province vehicle no." />
              <Field label="Model" value={vehicleForm.model} onChange={(value) => setVehicleForm({ ...vehicleForm, model: value })} placeholder="Brand and model" />
              <div className="md:col-span-2">
                <PrimaryButton icon={Car} disabled={saving} variant="amber">
                  {saving ? "Saving..." : "Add Vehicle"}
                </PrimaryButton>
              </div>
            </form>

            {detailsLoading ? (
              <p className="text-sm text-[oklch(0.5_0.012_70)]">Loading customer details...</p>
            ) : selectedCustomer ? (
              <div className="space-y-3">
                <DetailRow label="Name" value={selectedCustomer.fullName} strong />
                <DetailRow label="Phone" value={selectedCustomer.phone} />
                <DetailRow label="Email" value={selectedCustomer.email || "-"} />
              </div>
            ) : (
              <EmptyState title="No customer selected" text="Choose a customer to see vehicles and history." />
            )}
          </div>
        </DataCard>
      </div>

      <div className="grid xl:grid-cols-2 gap-6 mb-6">
        <DataCard title="Customer List">
          {loading ? (
            <p className="text-sm text-[oklch(0.5_0.012_70)]">Loading customers...</p>
          ) : customers.length === 0 ? (
            <EmptyState title="No customers found" text="Created customer records will appear here." />
          ) : (
            <TableShell>
              <TableHead>
                <Th>Name</Th>
                <Th>Phone</Th>
                <Th>Email</Th>
              </TableHead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.customerId}>
                    <Td className="font-semibold text-[oklch(0.18_0.012_60)]">{customer.fullName}</Td>
                    <Td>{customer.phone}</Td>
                    <Td>{customer.email || "-"}</Td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </DataCard>

        <DataCard title="Vehicles & Sale History">
          {!selectedCustomer ? (
            <EmptyState title="Select a customer" text="Vehicles and previous sales will show here." />
          ) : (
            <div className="space-y-5">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[oklch(0.205_0.012_60)]">Vehicles</h3>
                {selectedCustomer.vehicles.length === 0 ? (
                  <p className="text-sm text-[oklch(0.5_0.012_70)]">No vehicles recorded.</p>
                ) : (
                  selectedCustomer.vehicles.map((vehicle) => (
                    <div key={vehicle.vehicleId} className="rounded-2xl bg-[oklch(0.94_0.01_80)] p-4">
                      <div className="font-bold text-[oklch(0.18_0.012_60)]">{vehicle.vehicleNumber}</div>
                      <div className="mt-1 text-sm text-[oklch(0.5_0.012_70)]">{vehicle.model}</div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[oklch(0.205_0.012_60)]">Sale History</h3>
                {salesHistory.length === 0 ? (
                  <p className="text-sm text-[oklch(0.5_0.012_70)]">No sale history found.</p>
                ) : (
                  salesHistory.map((sale) => (
                    <DetailRow
                      key={sale.saleId}
                      label={`Sale #${sale.saleId}`}
                      value={`Rs. ${getSaleValue(sale)}`}
                      strong
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </DataCard>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <DataCard title="Customer Notes & Follow-Up">
          <form onSubmit={handleCreateFollowUp} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <SelectField
                label="Follow-Up Type"
                value={followUpForm.type}
                onChange={(value) => setFollowUpForm({ ...followUpForm, type: value })}
                options={[
                  { value: "Service reminder", label: "Service reminder" },
                  { value: "Pending credit call", label: "Pending credit call" },
                  { value: "Parts arrival update", label: "Parts arrival update" },
                  { value: "Regular customer check-in", label: "Regular customer check-in" },
                ]}
              />
              <Field
                label="Follow-Up Date"
                value={followUpForm.date}
                onChange={(value) => setFollowUpForm({ ...followUpForm, date: value })}
                type="date"
              />
            </div>
            <TextArea
              label="Staff Note"
              value={followUpForm.note}
              onChange={(value) => setFollowUpForm({ ...followUpForm, note: value })}
              placeholder="What should staff remember for this customer?"
            />
            <TextArea
              label="Private Customer Notes"
              value={customerNotes}
              onChange={setCustomerNotes}
              placeholder="Preferences, vehicle issues, preferred contact time, credit remarks..."
            />
            <PrimaryButton icon={PhoneCall} variant="amber">
              Add Follow-Up
            </PrimaryButton>
          </form>
        </DataCard>

        <DataCard title="Staff Follow-Up Queue">
          {followUps.length === 0 ? (
            <EmptyState title="No reminders yet" text="Create reminders for service, pending credit, or parts updates." />
          ) : (
            <div className="space-y-3">
              {followUps.map((item) => (
                <div key={item.id} className="rounded-2xl bg-[oklch(0.94_0.01_80)] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-bold text-[oklch(0.18_0.012_60)]">{item.customerName}</div>
                      <div className="mt-1 text-sm text-[oklch(0.5_0.012_70)]">{item.type} - {item.date}</div>
                    </div>
                    <StickyNote className="h-4 w-4 shrink-0 text-[oklch(0.42_0.05_65)]" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[oklch(0.42_0.012_70)]">{item.note}</p>
                </div>
              ))}
            </div>
          )}
        </DataCard>
      </div>
    </>
  );
}
