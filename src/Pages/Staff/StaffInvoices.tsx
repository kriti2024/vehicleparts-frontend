import { PageHeader, DataCard } from "../../components/staff/DashboardParts";

export default function StaffInvoices() {
  return (
    <>
      <PageHeader
        title="Invoices"
        subtitle="View sales invoices and payment details."
      />

      <DataCard title="Sales Invoices">
        <p className="text-sm text-gray-500">
          Invoice list UI will be added here.
        </p>
      </DataCard>
    </>
  );
}
