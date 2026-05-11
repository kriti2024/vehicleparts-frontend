import { PageHeader, DataCard } from "../../components/staff/DashboardParts";

export default function StaffSales() {
  return (
    <>
      <PageHeader
        title="New Sale"
        subtitle="Create sales, apply loyalty discount, and generate invoices."
      />

      <DataCard title="Sales Form">
        <p className="text-sm text-gray-500">
          Sales + invoice generation UI will be added here.
        </p>
      </DataCard>
    </>
  );
}
