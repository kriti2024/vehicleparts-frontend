import { useEffect, useState } from "react";

import { PageHeader, DataCard } from "../../components/staff/DashboardParts";

import {
  getCustomers,
  createCustomer,
  addVehicle,
} from "../../api/customerApi";

import type { Customer } from "../../types/customer";

export default function StaffCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [model, setModel] = useState("");

  const loadCustomers = async () => {
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

  useEffect(() => {
    const fetchCustomers = async () => {
      await loadCustomers();
    };

    fetchCustomers();
  }, []);

  const handleCreateCustomer = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await createCustomer({
        fullName,
        phone,
        email,
      });

      setFullName("");
      setPhone("");
      setEmail("");

      await loadCustomers();
    } catch {
      setError("Failed to create customer.");
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

      await addVehicle({
        customerId: Number(selectedCustomerId),
        vehicleNumber,
        model,
      });

      setSelectedCustomerId("");
      setVehicleNumber("");
      setModel("");
    } catch {
      setError("Failed to add vehicle.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="Register customers and attach vehicle details."
      />

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <DataCard title="Register Customer">
          <form onSubmit={handleCreateCustomer} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Phone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
                placeholder="Enter email address"
              />
            </div>

            <button
              disabled={saving}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
            >
              {saving ? "Saving..." : "Create Customer"}
            </button>
          </form>
        </DataCard>

        <DataCard title="Add Vehicle">
          <form onSubmit={handleAddVehicle} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Customer
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
              >
                <option value="">Select customer</option>

                {customers.map((customer) => (
                  <option key={customer.customerId} value={customer.customerId}>
                    {customer.fullName} - {customer.phone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Vehicle Number
              </label>
              <input
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
                placeholder="BA 12 PA 1234"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Model
              </label>
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
                placeholder="Toyota Corolla"
              />
            </div>

            <button
              disabled={saving}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-black hover:bg-amber-400 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Add Vehicle"}
            </button>
          </form>
        </DataCard>
      </div>

      <DataCard title="Customer List">
        {loading ? (
          <p className="text-sm text-gray-500">Loading customers...</p>
        ) : customers.length === 0 ? (
          <p className="text-sm text-gray-500">No customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wider text-gray-500">
                  <th className="py-3">Name</th>
                  <th className="py-3">Phone</th>
                  <th className="py-3">Email</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.customerId}
                    className="border-b border-gray-100"
                  >
                    <td className="py-3 font-medium text-gray-900">
                      {customer.fullName}
                    </td>

                    <td className="py-3 text-gray-600">{customer.phone}</td>

                    <td className="py-3 text-gray-600">
                      {customer.email || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DataCard>
    </>
  );
}
