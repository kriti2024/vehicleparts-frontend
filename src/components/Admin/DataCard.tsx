type DataCardProps = {
    title: string;
    children: React.ReactNode;
};

export default function DataCard({
    title,
    children,
}: DataCardProps) {
    return (
        <div className="rounded-3xl border border-[oklch(0.88_0.012_80)] bg-[oklch(0.985_0.008_85)]">
            <div className="border-b border-[oklch(0.88_0.012_80)] px-6 py-5">
                <h2 className="text-sm font-semibold tracking-wide text-[oklch(0.205_0.012_60)]">
                    {title}
                </h2>
            </div>

            <div className="p-6">
                {children}
            </div>
        </div>
    );
}