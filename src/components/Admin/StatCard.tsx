type StatCardProps = {
    label: string;
    value: string;
    hint?: string;
};

export default function StatCard({
    label,
    value,
    hint,
}: StatCardProps) {
    return (
        <div className="rounded-3xl border border-[oklch(0.88_0.012_80)] bg-[oklch(0.985_0.008_85)] p-6">
            <div className="text-[10px] tracking-[0.25em] uppercase text-[oklch(0.5_0.012_70)]">
                {label}
            </div>

            <div className="mt-3 text-4xl font-bold tracking-tight text-[oklch(0.205_0.012_60)]">
                {value}
            </div>

            {hint && (
                <div className="mt-2 text-sm text-[oklch(0.5_0.012_70)]">
                    {hint}
                </div>
            )}
        </div>
    );
}