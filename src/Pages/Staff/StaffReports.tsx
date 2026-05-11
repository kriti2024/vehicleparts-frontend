import { PageHeader, DataCard } from "../../components/staff/DashboardParts";

export default function StaffReports() {
  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="View customer and sales insights."
      />

      <DataCard title="Reports Overview">
        <p className="text-sm text-gray-500">Reports UI will be added here.</p>
      </DataCard>
    </>
  );
}
