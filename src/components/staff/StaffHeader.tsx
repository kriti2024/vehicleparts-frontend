interface StaffHeaderProps {
    role?: string;
}

export default function StaffHeader({
    role = "Staff",
}: StaffHeaderProps) {
    return (
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">

            <div className="text-xs tracking-[0.2em] uppercase text-gray-500">
                {role} Workspace
            </div>

            <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gray-900 text-white grid place-items-center text-xs font-semibold">
                    {role[0]}
                </div>
            </div>
        </header>
    );
}