import { PageHeader, DataCard } from "../../components/staff/DashboardParts";

export default function StaffSearch() {
  return (
    <>
      <PageHeader
        title="Search"
        subtitle="Search customers by name, phone, or vehicle number."
      />

      <DataCard title="Customer Search">
        <p className="text-sm text-gray-500">Search UI will be added here.</p>
      </DataCard>
    </>
  );
}
