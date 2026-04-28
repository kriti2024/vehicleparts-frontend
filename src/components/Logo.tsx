export default function AutoCoreLogo({
    className = "",
    iconOnly = false,
}: {
    className?: string;
    iconOnly?: boolean;
}) {
    return (
        <svg
            viewBox={iconOnly ? "0 0 72 64" : "0 0 240 80"}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className={className}
        >
            <defs>
                <clipPath id="hexClip">
                    <path d="M36,2 L62,16 L62,46 L36,60 L10,46 L10,16 Z" />
                </clipPath>
            </defs>

            <path d="M36,2 L62,16 L62,46 L36,60 L10,46 L10,16 Z" fill="#0F172A" stroke="#22D3EE" strokeWidth="1.5" />
            <path d="M36,7 L57,19 L57,43 L36,55 L15,43 L15,19 Z" fill="none" stroke="#22D3EE" strokeWidth="0.5" opacity="0.25" />
            <path d="M20,40 L24,30 C25,27 27,26 30,26 L42,26 C45,26 47,27 48,30 L52,40 Z" fill="#E2E8F0" />
            <path d="M28,29 L44,29 L47,35 L25,35 Z" fill="#22D3EE" />
            <rect x="18" y="37" width="36" height="7" rx="2" fill="#E2E8F0" />
            <circle cx="26" cy="47" r="4.5" fill="#0F172A" stroke="#22D3EE" strokeWidth="1.5" />
            <circle cx="26" cy="47" r="1.8" fill="#22D3EE" />
            <circle cx="46" cy="47" r="4.5" fill="#0F172A" stroke="#22D3EE" strokeWidth="1.5" />
            <circle cx="46" cy="47" r="1.8" fill="#22D3EE" />
            <circle cx="36" cy="9" r="2.2" fill="#22D3EE" />
            <rect x="34.5" y="11" width="3" height="8" rx="1" fill="#22D3EE" />

            {!iconOnly && (
                <>
                    <text x="76" y="34" fontFamily="'Inter','Segoe UI',sans-serif" fontSize="22" fontWeight="600" fill="#E2E8F0" letterSpacing="-0.5">
                        Auto<tspan fill="#22D3EE">Core</tspan>
                    </text>
                    <line x1="76" y1="40" x2="232" y2="40" stroke="#1E293B" strokeWidth="0.8" />
                    <circle cx="72" cy="40" r="2" fill="#22D3EE" />
                </>
            )}
        </svg>
    );
}