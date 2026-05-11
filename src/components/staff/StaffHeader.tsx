import { Bell } from "lucide-react";

interface StaffHeaderProps {
  role?: string;
}

export default function StaffHeader({ role = "Staff" }: StaffHeaderProps) {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <div className="text-xs tracking-[0.2em] uppercase text-gray-500">
        {role} Workspace
      </div>

      <div className="flex items-center gap-3">
        <button className="relative h-9 w-9 grid place-items-center rounded-full hover:bg-gray-100">
          <Bell className="h-4 w-4" />

          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500" />
        </button>

        <div className="h-9 w-9 rounded-full bg-gray-900 text-white grid place-items-center text-xs font-semibold">
          {role[0]}
        </div>
      </div>
    </header>
  );
}
