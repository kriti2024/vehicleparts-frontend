import { Link } from "react-router-dom";

interface LogoProps {
    dark?: boolean;
}

export function Logo({ dark = false }: LogoProps) {
    const text = dark ? "text-[oklch(0.97_0.012_85)]" : "text-[oklch(0.205_0.012_60)]";
    const border = dark ? "border-[oklch(0.97_0.012_85)]/40" : "border-[oklch(0.205_0.012_60)]/40";

    return (
        <Link to="/" className={`flex items-center gap-3 ${text}`}>
            {/* Icon mark */}
            <div className="relative h-9 w-9 shrink-0">
                <div className={`absolute inset-0 rounded-full border ${border}`} />
                <div className="absolute inset-[9px] rounded-sm rotate-45 border-2 border-[oklch(0.74_0.16_65)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.16_65)]" />
                </div>
            </div>

            {/* Wordmark */}
            <div className="flex flex-col leading-none">
                <span className={`text-[13px] font-black tracking-[0.25em] uppercase ${text}`}>
                    AXLE<span className="text-[oklch(0.74_0.16_65)]">WORKS</span>
                </span>
                <span className={`text-[8px] tracking-[0.4em] uppercase mt-0.5 ${dark ? "text-[oklch(0.97_0.012_85)]/50" : "text-[oklch(0.205_0.012_60)]/50"}`}>
                    Service Center
                </span>
            </div>
        </Link>
    );
}