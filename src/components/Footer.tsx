import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { ArrowUpRight } from "lucide-react";

interface FooterLink {
    label: string;
    to: string;
}


const companyLinks: FooterLink[] = [
    { label: "Services", to: "/services" },
    { label: "Parts Catalog", to: "/parts" },
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
];

export function Footer() {
    return (
        <footer className="bg-[oklch(0.18_0.012_60)] text-[oklch(0.92_0.012_80)]">

            <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-4 gap-12">

                {/* Brand */}
                <div className="md:col-span-2 space-y-5">
                    <Logo dark />
                    <p className="text-sm text-[oklch(0.92_0.012_80)]/50 leading-relaxed max-w-xs">
                        The complete vehicle management platform engineered for
                        admins, staff, and customers alike.
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                        <div className="h-px w-8 bg-[oklch(0.74_0.16_65)]" />
                        <span className="text-[10px] tracking-[0.3em] uppercase text-[oklch(0.74_0.16_65)]">
                            Est. 2026
                        </span>
                    </div>
                </div>

                {/* Company links */}
                <div>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-[oklch(0.74_0.16_65)] mb-5">
                        Company
                    </div>
                    <div className="space-y-4">
                        {companyLinks.map((l) => (
                            <Link
                                key={l.label}
                                to={l.to}
                                className="flex items-center gap-1 text-sm text-[oklch(0.92_0.012_80)]/60 hover:text-[oklch(0.74_0.16_65)] transition group"
                            >
                                {l.label}
                                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-[oklch(0.92_0.012_80)]/10">
                <div className="mx-auto max-w-7xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-[11px] tracking-[0.2em] uppercase text-[oklch(0.92_0.012_80)]/30">
                        © 2026 Axleworks Service Center
                    </span>
                    <span className="text-[11px] tracking-[0.2em] uppercase text-[oklch(0.92_0.012_80)]/30">
                        Vehicle Parts & Inventory Management
                    </span>
                </div>
            </div>
        </footer>
    );
}