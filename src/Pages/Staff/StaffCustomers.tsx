import { PageHeader, DataCard } from "../../components/staff/DashboardParts";

export default function StaffCustomers() {
  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="Register and manage customer vehicle records."
      />

      <DataCard title="Customer Management">
        <p className="text-sm text-gray-500">
          Customer + vehicle registration UI will be added here.
        </p>
      </DataCard>
    </>
  );
}
