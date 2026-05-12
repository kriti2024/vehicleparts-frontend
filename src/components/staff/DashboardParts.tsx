import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <div className="text-[11px] tracking-[0.25em] uppercase text-gray-500 mb-2">
          Vehicle Parts System
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          {title}
        </h1>

        {subtitle && <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>}
      </div>

      {action}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="text-[11px] tracking-[0.2em] uppercase text-gray-500">
        {label}
      </div>

      <div className="mt-2 text-3xl font-semibold text-gray-900">{value}</div>

      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
    </div>
  );
}

interface DataCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export function DataCard({ title, action, children }: DataCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h2 className="text-sm font-semibold tracking-wide text-gray-900">
          {title}
        </h2>

        {action}
      </div>

      <div className="p-5">{children}</div>
    </div>
  );
}
