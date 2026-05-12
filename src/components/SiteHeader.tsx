import { Link } from "react-router-dom";
import { Logo } from "./Logo";

interface SiteHeaderProps {
    dark?: boolean;
}

export function SiteHeader({ dark = false }: SiteHeaderProps) {
    const navColor = dark
        ? "text-[oklch(0.97_0.012_85)]/70"
        : "text-[oklch(0.205_0.012_60)]/70";

    const btnBg = dark
        ? "bg-[oklch(0.97_0.012_85)] text-[oklch(0.205_0.012_60)] hover:bg-white"
        : "bg-[oklch(0.235_0.012_60)] text-[oklch(0.97_0.012_85)] hover:bg-[oklch(0.205_0.012_60)]";

    return (
        <header className="absolute top-0 left-0 right-0 z-30">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
                <Logo dark={dark} />

                <nav className={`hidden md:flex items-center gap-8 text-xs tracking-[0.2em] uppercase ${navColor}`}>
                    {[
                        { label: "Home", to: "/" },
                        { label: "Services", to: "/services" },
                        { label: "Parts", to: "/parts" },
                        { label: "About", to: "/about" },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            to={item.to}
                            className="transition hover:text-[oklch(0.74_0.16_65)]"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className={`rounded-full px-5 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase transition ${btnBg}`}
                    >
                        Sign In
                    </Link>

                    <Link
                        to="/register"
                        className={`rounded-full px-5 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase transition ${btnBg}`}
                    >
                        Register
                    </Link>
                </div>
            </div>
        </header>
    );
}