import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Wrench } from "lucide-react";

import { cn } from "../../lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  message?: string;
  action?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  eyebrow = "Vehicle Parts System",
  message,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-8 rounded-3xl border border-[oklch(0.88_0.012_80)] bg-[oklch(0.985_0.008_85)] p-6 shadow-[0_18px_50px_-34px_oklch(0.2_0.012_60)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] tracking-[0.3em] uppercase text-[oklch(0.48_0.04_65)]">
            {eyebrow}
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[oklch(0.16_0.01_60)]">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[oklch(0.46_0.015_70)]">
              {subtitle}
            </p>
          )}
        </div>

        {action}
      </div>

      {message && (
        <div className="mt-5 rounded-2xl border border-[oklch(0.86_0.035_82)] bg-[oklch(0.94_0.01_80)] px-4 py-3 text-sm font-medium text-[oklch(0.3_0.045_65)]">
          {message}
        </div>
      )}
    </div>
  );
}

export function InlineAlert({
  children,
  tone = "error",
}: {
  children: ReactNode;
  tone?: "error" | "success" | "info";
}) {
  const styles = {
    error:
      "border-red-200 bg-red-50 text-red-700",
    success:
      "border-green-200 bg-green-50 text-green-700",
    info:
      "border-[oklch(0.86_0.035_82)] bg-[oklch(0.94_0.01_80)] text-[oklch(0.3_0.045_65)]",
  };

  return (
    <div className={cn("mb-5 rounded-2xl border px-4 py-3 text-sm font-medium", styles[tone])}>
      {children}
    </div>
  );
}

interface ActionCardProps {
  title: string;
  text: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
}

export function ActionCard({ title, text, icon: Icon, href, onClick }: ActionCardProps) {
  const className =
    "block rounded-2xl border border-[oklch(0.88_0.012_80)] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[oklch(0.74_0.16_65)] hover:shadow-[0_16px_35px_-28px_oklch(0.2_0.012_60)]";

  const content = (
    <>
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[oklch(0.92_0.13_75)] text-[oklch(0.18_0.012_60)]">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="mt-4 text-sm font-bold text-[oklch(0.18_0.012_60)]">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-[oklch(0.5_0.012_70)]">{text}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

export function PrimaryButton({
  children,
  icon: Icon,
  type = "submit",
  onClick,
  disabled,
  variant = "solid",
}: {
  children: ReactNode;
  icon?: LucideIcon;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  variant?: "solid" | "outline" | "amber";
}) {
  const styles = {
    solid:
      "bg-[oklch(0.205_0.012_60)] text-white hover:opacity-90",
    outline:
      "border border-[oklch(0.88_0.012_80)] bg-white text-[oklch(0.205_0.012_60)] hover:bg-[oklch(0.94_0.01_80)]",
    amber:
      "bg-[oklch(0.74_0.16_65)] text-[oklch(0.18_0.012_60)] hover:opacity-90",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] transition disabled:cursor-wait disabled:opacity-60",
        styles[variant],
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.5_0.012_70)]">
        {label}
      </span>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-[oklch(0.88_0.012_80)] bg-white px-4 py-3 text-sm text-[oklch(0.205_0.012_60)] outline-none transition placeholder:text-[oklch(0.6_0.012_70)] focus:ring-2 focus:ring-accent"
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.5_0.012_70)]">
        {label}
      </span>
      <textarea
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 min-h-28 w-full rounded-2xl border border-[oklch(0.88_0.012_80)] bg-white px-4 py-3 text-sm text-[oklch(0.205_0.012_60)] outline-none transition placeholder:text-[oklch(0.6_0.012_70)] focus:ring-2 focus:ring-accent"
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.5_0.012_70)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="mt-2 w-full rounded-2xl border border-[oklch(0.88_0.012_80)] bg-white px-4 py-3 text-sm text-[oklch(0.205_0.012_60)] outline-none focus:ring-2 focus:ring-accent"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-[oklch(0.94_0.01_80)] p-8 text-center">
      <Wrench className="mx-auto h-6 w-6 text-[oklch(0.45_0.012_70)]" />
      <div className="mt-3 font-semibold text-[oklch(0.205_0.012_60)]">{title}</div>
      <div className="mt-1 text-sm text-[oklch(0.5_0.012_70)]">{text}</div>
    </div>
  );
}

export function DetailRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-[oklch(0.94_0.01_80)] px-4 py-3">
      <span className="text-sm text-[oklch(0.5_0.012_70)]">{label}</span>
      <span className={cn("text-right text-sm text-[oklch(0.205_0.012_60)]", strong && "text-base font-bold")}>
        {value}
      </span>
    </div>
  );
}

export function StatusPill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const styles = {
    neutral: "bg-[oklch(0.94_0.01_80)] text-[oklch(0.36_0.012_70)]",
    success: "bg-green-100 text-green-700",
    warning: "bg-[oklch(0.92_0.13_75)] text-[oklch(0.24_0.045_65)]",
    danger: "bg-red-100 text-red-700",
  };

  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-bold", styles[tone])}>
      {children}
    </span>
  );
}

export function TableShell({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[oklch(0.9_0.012_80)] bg-white">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-[oklch(0.9_0.012_80)] bg-[oklch(0.94_0.01_80)] text-left text-[10px] uppercase tracking-[0.2em] text-[oklch(0.5_0.012_70)]">
        {children}
      </tr>
    </thead>
  );
}

export function Th({ children }: { children: ReactNode }) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={cn("border-b border-[oklch(0.93_0.01_80)] px-4 py-3 align-top", className)}>{children}</td>;
}

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: "dark" | "amber" | "light";
}

export function StatCard({ label, value, hint, icon: Icon, tone = "light" }: StatCardProps) {
  const styles = {
    dark: "bg-[oklch(0.18_0.012_60)] text-white",
    amber: "bg-[oklch(0.92_0.13_75)] text-[oklch(0.18_0.012_60)]",
    light:
      "border border-[oklch(0.88_0.012_80)] bg-[oklch(0.985_0.008_85)] text-[oklch(0.18_0.012_60)]",
  };

  return (
    <div className={cn("min-h-36 rounded-3xl p-5", styles[tone])}>
      <div className="flex items-center justify-between">
        <span className="rounded-xl bg-white/70 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[oklch(0.42_0.05_65)]">
          {label}
        </span>
        {Icon && <Icon className="h-4 w-4 opacity-70" />}
      </div>
      <div className="mt-6 text-3xl font-bold tracking-tight">{value}</div>
      {hint && <div className="mt-2 text-xs opacity-70">{hint}</div>}
    </div>
  );
}

interface DataCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DataCard({ title, action, children, className = "" }: DataCardProps) {
  return (
    <section className={cn("rounded-3xl border border-[oklch(0.88_0.012_80)] bg-[oklch(0.985_0.008_85)]", className)}>
      <div className="flex items-center justify-between gap-4 border-b border-[oklch(0.88_0.012_80)] px-6 py-5">
        <h2 className="text-base font-semibold tracking-tight text-[oklch(0.205_0.012_60)]">
          {title}
        </h2>
        {action}
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
}
