import { useEffect, useMemo, useState } from "react";
import { CreditCard, Mail, PhoneCall, ShieldCheck } from "lucide-react";

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
  getCustomerCredits,
  updateCustomerCredit,
  type CustomerCredit,
} from "../../api/staffOperationsApi";

const initialCredits: CustomerCredit[] = [
  {
    id: "CR-221",
    customer: "Regular Customer",
    phone: "9800000000",
    email: "customer@email.com",
    amount: 8500,
    dueDate: new Date().toISOString().slice(0, 10),
    status: "Pending",
    note: "Call after 4 PM.",
  },
  {
    id: "CR-222",
    customer: "Fleet Buyer",
    phone: "9811111111",
    email: "fleet@email.com",
    amount: 12400,
    dueDate: new Date().toISOString().slice(0, 10),
    status: "Promised",
    note: "Promised to clear after invoice approval.",
  },
];

export default function StaffCredits() {
  const [credits, setCredits] = useState<CustomerCredit[]>(initialCredits);
  const [selectedId, setSelectedId] = useState(initialCredits[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const selected = credits.find((credit) => credit.id === selectedId);
  const summary = useMemo(
    () => ({
      pending: credits.filter((credit) => credit.status !== "Paid").length,
      paid: credits.filter((credit) => credit.status === "Paid").length,
      total: credits.reduce((sum, credit) => sum + (credit.status === "Paid" ? 0 : credit.amount), 0),
    }),
    [credits],
  );

  useEffect(() => {
    const loadCredits = async () => {
      try {
        const data = await getCustomerCredits();
        setCredits(data);
        setSelectedId(data[0]?.id ?? "");
        setMessage("Customer credits connected to backend.");
      } catch {
        setMessage("Showing fallback credit accounts. Start backend for live updates.");
      }
    };

    loadCredits();
  }, []);

  const updateCredit = async (status: CustomerCredit["status"]) => {
    if (!selected) return;

    try {
      const updated = await updateCustomerCredit(selected.id, status, note);
      setCredits((current) => current.map((credit) => (credit.id === selected.id ? updated : credit)));
      setMessage(`Credit account ${selected.id} saved as ${status}.`);
    } catch {
      setCredits((current) =>
        current.map((credit) =>
          credit.id === selected.id
            ? { ...credit, status, note: note || credit.note }
            : credit,
        ),
      );
      setMessage(`Backend unavailable, credit account marked locally as ${status}.`);
    }
  };

  const reminderHref = selected
    ? `mailto:${selected.email}?subject=${encodeURIComponent("Payment reminder")}&body=${encodeURIComponent(
        `Dear ${selected.customer},\n\nThis is a reminder for your pending credit of Rs. ${selected.amount}, due on ${selected.dueDate}.\n\nThank you.`,
      )}`
    : "";

  return (
    <>
      <PageHeader
        eyebrow="Credit Desk"
        title="Customer Credits"
        subtitle="Track pending customer balances, follow-up notes, payment promises, and reminder actions."
        message={message}
      />

      <div className="mb-6 grid md:grid-cols-4 gap-5">
        <StatCard icon={CreditCard} label="Outstanding" value={`Rs. ${summary.total}`} hint="Unpaid credit total" tone="dark" />
        <StatCard icon={PhoneCall} label="Follow-Ups" value={summary.pending} hint="Needs staff action" tone="amber" />
        <StatCard icon={ShieldCheck} label="Cleared" value={summary.paid} hint="Marked paid" />
        <StatCard icon={Mail} label="Reminders" value="Ready" hint="Mail drafts enabled" />
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <DataCard className="xl:col-span-2" title="Credit Accounts">
          {credits.length === 0 ? (
            <EmptyState title="No credit accounts" text="Pending customer credits will appear here." />
          ) : (
            <TableShell>
              <TableHead>
                <Th>Customer</Th>
                <Th>Due</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
              </TableHead>
              <tbody>
                {credits.map((credit) => (
                  <tr key={credit.id}>
                    <Td>
                      <button type="button" onClick={() => setSelectedId(credit.id)} className="text-left font-bold text-[oklch(0.18_0.012_60)]">
                        {credit.customer}
                      </button>
                      <div className="mt-1 text-xs text-[oklch(0.5_0.012_70)]">{credit.phone}</div>
                    </Td>
                    <Td>{credit.dueDate}</Td>
                    <Td className="font-bold">Rs. {credit.amount}</Td>
                    <Td>
                      <StatusPill tone={credit.status === "Paid" ? "success" : credit.status === "Promised" ? "warning" : "danger"}>
                        {credit.status}
                      </StatusPill>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </DataCard>

        <DataCard title="Follow-Up Panel">
          {!selected ? (
            <EmptyState title="Select account" text="Choose a customer credit account to update." />
          ) : (
            <div className="space-y-4">
              <DetailRow label="Customer" value={selected.customer} strong />
              <DetailRow label="Phone" value={selected.phone} />
              <DetailRow label="Amount" value={`Rs. ${selected.amount}`} strong />
              <DetailRow label="Due Date" value={selected.dueDate} />
              <SelectField
                label="Account"
                value={selectedId}
                onChange={setSelectedId}
                options={credits.map((credit) => ({ value: credit.id, label: `${credit.customer} - Rs. ${credit.amount}` }))}
              />
              <Field label="Call Note" value={note} onChange={setNote} required={false} placeholder={selected.note} />
              <TextArea label="Reminder Script" value={`Pending amount Rs. ${selected.amount}. Due date ${selected.dueDate}.`} onChange={() => undefined} />
              <div className="flex flex-wrap gap-3">
                <PrimaryButton type="button" icon={PhoneCall} variant="outline" onClick={() => updateCredit("Promised")}>
                  Promised
                </PrimaryButton>
                <PrimaryButton type="button" icon={ShieldCheck} variant="amber" onClick={() => updateCredit("Paid")}>
                  Mark Paid
                </PrimaryButton>
                <a href={reminderHref} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[oklch(0.205_0.012_60)] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:opacity-90">
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </div>
            </div>
          )}
        </DataCard>
      </div>
    </>
  );
}
