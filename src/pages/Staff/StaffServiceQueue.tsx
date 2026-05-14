import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock, Plus, Wrench } from "lucide-react";

import {
  DataCard,
  DetailRow,
  EmptyState,
  Field,
  PageHeader,
  PrimaryButton,
  SelectField,
  StatCard,
  StatusPill,
  TableHead,
  TableShell,
  Td,
  TextArea,
  Th,
} from "../../components/staff/DashboardParts";
import {
  createServiceJob,
  getServiceQueue,
  updateServiceJobStatus,
  type ServiceJob,
} from "../../api/staffOperationsApi";

const initialJobs: ServiceJob[] = [
  {
    id: "JOB-1048",
    customer: "Walk-in customer",
    vehicle: "BA 12 PA 1234",
    service: "Brake inspection",
    date: new Date().toISOString().slice(0, 10),
    priority: "High",
    status: "In Progress",
    notes: "Check front brake pads before invoice.",
  },
  {
    id: "JOB-1049",
    customer: "Regular customer",
    vehicle: "BAG 4412",
    service: "Oil change",
    date: new Date().toISOString().slice(0, 10),
    priority: "Normal",
    status: "Waiting",
    notes: "Use 5W-30 synthetic oil.",
  },
];

export default function StaffServiceQueue() {
  const [jobs, setJobs] = useState<ServiceJob[]>(initialJobs);
  const [form, setForm] = useState({
    customer: "",
    vehicle: "",
    service: "Full service",
    date: new Date().toISOString().slice(0, 10),
    priority: "Normal" as ServiceJob["priority"],
    notes: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadQueue = async () => {
      try {
        setJobs(await getServiceQueue());
        setMessage("Service queue connected to backend.");
      } catch {
        setMessage("Showing fallback service queue. Start backend for live updates.");
      }
    };

    loadQueue();
  }, []);

  const totals = useMemo(
    () => ({
      waiting: jobs.filter((job) => job.status === "Waiting").length,
      active: jobs.filter((job) => job.status === "In Progress").length,
      ready: jobs.filter((job) => job.status === "Ready").length,
    }),
    [jobs],
  );

  const handleCreateJob = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const job = await createServiceJob(form);
      setJobs((current) => [job, ...current]);
      setMessage("Service job saved in backend.");
    } catch {
      const job: ServiceJob = {
        id: `JOB-${Date.now().toString().slice(-4)}`,
        customer: form.customer,
        vehicle: form.vehicle,
        service: form.service,
        date: form.date,
        priority: form.priority,
        status: "Waiting",
        notes: form.notes || "No extra notes.",
      };
      setJobs((current) => [job, ...current]);
      setMessage("Backend unavailable, job added locally.");
    } finally {
      setForm({
        customer: "",
        vehicle: "",
        service: "Full service",
        date: new Date().toISOString().slice(0, 10),
        priority: "Normal",
        notes: "",
      });
    }
  };

  const updateStatus = async (id: string, status: ServiceJob["status"]) => {
    try {
      const updated = await updateServiceJobStatus(id, status);
      setJobs((current) => current.map((job) => (job.id === id ? updated : job)));
      setMessage(`Service job ${id} saved as ${status}.`);
    } catch {
      setJobs((current) => current.map((job) => (job.id === id ? { ...job, status } : job)));
      setMessage(`Backend unavailable, service job marked locally as ${status}.`);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Workshop Desk"
        title="Service Queue"
        subtitle="Track walk-in jobs, service appointments, vehicle status, and workshop priorities."
        message={message}
      />

      <div className="mb-6 grid md:grid-cols-4 gap-5">
        <StatCard icon={CalendarDays} label="Jobs" value={jobs.length} hint="Total in queue" tone="dark" />
        <StatCard icon={Clock} label="Waiting" value={totals.waiting} hint="Not started" tone="amber" />
        <StatCard icon={Wrench} label="Active" value={totals.active} hint="Being worked on" />
        <StatCard icon={CheckCircle2} label="Ready" value={totals.ready} hint="Ready for pickup" />
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <DataCard title="Add Service Job">
          <form onSubmit={handleCreateJob} className="space-y-5">
            <Field label="Customer" value={form.customer} onChange={(value) => setForm({ ...form, customer: value })} placeholder="Customer name" />
            <Field label="Vehicle Number" value={form.vehicle} onChange={(value) => setForm({ ...form, vehicle: value })} placeholder="BA 12 PA 1234" />
            <SelectField
              label="Service Type"
              value={form.service}
              onChange={(value) => setForm({ ...form, service: value })}
              options={[
                { value: "Full service", label: "Full service" },
                { value: "Oil change", label: "Oil change" },
                { value: "Brake inspection", label: "Brake inspection" },
                { value: "Parts fitting", label: "Parts fitting" },
                { value: "Electrical check", label: "Electrical check" },
              ]}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Date" type="date" value={form.date} onChange={(value) => setForm({ ...form, date: value })} />
              <SelectField
                label="Priority"
                value={form.priority}
                onChange={(value) => setForm({ ...form, priority: value as ServiceJob["priority"] })}
                options={[
                  { value: "Normal", label: "Normal" },
                  { value: "High", label: "High" },
                  { value: "Urgent", label: "Urgent" },
                ]}
              />
            </div>
            <TextArea label="Notes" value={form.notes} onChange={(value) => setForm({ ...form, notes: value })} placeholder="Work required, parts needed, customer requests..." />
            <PrimaryButton icon={Plus} variant="amber">Add Job</PrimaryButton>
          </form>
        </DataCard>

        <DataCard className="xl:col-span-2" title="Live Queue">
          {jobs.length === 0 ? (
            <EmptyState title="No service jobs" text="Service work will appear here when staff adds jobs." />
          ) : (
            <TableShell>
              <TableHead>
                <Th>Job</Th>
                <Th>Vehicle</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </TableHead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <Td>
                      <div className="font-bold text-[oklch(0.18_0.012_60)]">{job.id}</div>
                      <div className="mt-1 text-xs text-[oklch(0.5_0.012_70)]">{job.customer} - {job.service}</div>
                    </Td>
                    <Td>
                      <div className="font-semibold">{job.vehicle}</div>
                      <div className="mt-1 text-xs text-[oklch(0.5_0.012_70)]">{job.date} - {job.priority}</div>
                    </Td>
                    <Td>
                      <StatusPill tone={job.status === "Ready" ? "success" : job.priority === "Urgent" ? "danger" : "warning"}>
                        {job.status}
                      </StatusPill>
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => updateStatus(job.id, "In Progress")} className="rounded-xl bg-[oklch(0.205_0.012_60)] px-3 py-2 text-xs font-bold text-white">Start</button>
                        <button type="button" onClick={() => updateStatus(job.id, "Ready")} className="rounded-xl bg-green-100 px-3 py-2 text-xs font-bold text-green-700">Ready</button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </DataCard>

        <DataCard className="xl:col-span-3" title="Workshop Notes">
          <div className="grid md:grid-cols-3 gap-4">
            {jobs.slice(0, 3).map((job) => (
              <DetailRow key={job.id} label={job.id} value={job.notes} />
            ))}
          </div>
        </DataCard>
      </div>
    </>
  );
}
