import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { Footer } from "../components/Footer";
import heroCar from "../assets/hero-car.jpg";
import { ArrowUpRight, Wrench, Package, Sparkles } from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[oklch(0.965_0.012_85)] text-[oklch(0.205_0.012_60)] overflow-x-hidden">
            <SiteHeader />

            {/* HERO */}
            <section className="relative min-h-screen flex flex-col">
                <img
                    src={heroCar}
                    alt="Concept vehicle"
                    className="absolute inset-0 h-full w-full object-cover opacity-95"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.965_0.012_85)]/20 via-transparent to-[oklch(0.965_0.012_85)]" />

                <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-32">
                    <div className="text-[11px] tracking-[0.35em] uppercase text-[oklch(0.205_0.012_60)]/60 mb-6">
                        Limited Edition · Service Center
                    </div>

                    <h1 className="font-black tracking-tighter text-[oklch(0.205_0.012_60)] text-[18vw] md:text-[8rem] leading-[0.82]">
                        DRIVE
                        <br />
                        TOMORROW
                        <br />
                        <span className="text-[oklch(0.74_0.16_65)]">TODAY</span>
                    </h1>

                    <p className="mt-8 max-w-2xl text-sm md:text-base text-[oklch(0.205_0.012_60)]/70 leading-relaxed">
                        Beyond parts. Beyond service. The complete vehicle management
                        platform engineered for admins, staff, and customers alike.
                    </p>

                    <div className="mt-10 flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/login"
                            className="rounded-full bg-[oklch(0.235_0.012_60)] text-[oklch(0.97_0.012_85)] px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[oklch(0.205_0.012_60)] transition-all inline-flex items-center gap-2"
                        >
                            Enter Platform
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>

                        <Link
                            to="/services"
                            className="rounded-full border border-[oklch(0.205_0.012_60)]/30 px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[oklch(0.205_0.012_60)]/10 transition"
                        >
                            Explore Services
                        </Link>
                    </div>
                </div>

                {/* STATS */}
                <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-[oklch(0.88_0.012_80)] border-t border-[oklch(0.88_0.012_80)]">
                    {[
                        { v: "1,847", l: "Parts in stock" },
                        { v: "99.9%", l: "Service rating" },
                        { v: "0.8s", l: "Invoice generation" },
                        { v: "15K+", l: "Happy customers" },
                    ].map((s) => (
                        <div key={s.l} className="bg-[oklch(0.965_0.012_85)] px-6 py-8">
                            <div className="text-3xl font-bold text-[oklch(0.205_0.012_60)]">{s.v}</div>
                            <div className="text-[10px] tracking-[0.25em] uppercase text-[oklch(0.5_0.012_70)] mt-2">{s.l}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ROLES */}
            <section className="py-28 px-6 bg-[oklch(0.965_0.012_85)]">
                <div className="mx-auto max-w-7xl">
                    <div className="text-[11px] tracking-[0.3em] uppercase text-[oklch(0.5_0.012_70)]">
                        Built for everyone
                    </div>

                    <h2 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight max-w-4xl text-[oklch(0.205_0.012_60)]">
                        One platform.
                        <br />
                        Three workspaces.
                        <span className="text-[oklch(0.74_0.16_65)]"> Zero friction.</span>
                    </h2>

                    <div className="mt-16 grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Sparkles,
                                role: "Admin",
                                desc: "Full control over staff, vendors, parts, purchase invoices and financial reports.",
                                to: "/admin",
                            },
                            {
                                icon: Wrench,
                                role: "Staff",
                                desc: "Register customers, sell parts, generate invoices and email them instantly.",
                                to: "/staff",
                            },
                            {
                                icon: Package,
                                role: "Customer",
                                desc: "Book appointments, request parts and track service history easily.",
                                to: "/customer",
                            },
                        ].map((c) => (
                            <Link
                                key={c.role}
                                to={c.to}
                                className="group rounded-3xl border border-[oklch(0.88_0.012_80)] bg-[oklch(0.985_0.008_85)] p-8 hover:border-[oklch(0.74_0.16_65)] transition-all duration-300 hover:-translate-y-2"
                            >
                                <c.icon className="h-8 w-8 text-[oklch(0.74_0.16_65)]" />

                                <div className="mt-8 text-3xl font-semibold tracking-tight text-[oklch(0.205_0.012_60)]">
                                    {c.role}
                                </div>

                                <p className="mt-3 text-sm text-[oklch(0.5_0.012_70)] leading-relaxed">
                                    {c.desc}
                                </p>

                                <div className="mt-8 inline-flex items-center gap-1 text-xs font-bold tracking-[0.2em] uppercase text-[oklch(0.205_0.012_60)] group-hover:text-[oklch(0.74_0.16_65)]">
                                    Open workspace
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="py-28 px-6 bg-[oklch(0.92_0.014_80)] border-y border-[oklch(0.88_0.012_80)]">
                <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-20">
                    <div>
                        <div className="text-[11px] tracking-[0.3em] uppercase text-[oklch(0.5_0.012_70)]">
                            The system
                        </div>

                        <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-[oklch(0.205_0.012_60)]">
                            Engineered to keep your business moving.
                        </h2>

                        <p className="mt-6 text-[oklch(0.5_0.012_70)] leading-relaxed text-lg">
                            From low-stock alerts under 10 units to overdue credit reminders
                            past 30 days — automation handles the busywork so your team
                            focuses on customers.
                        </p>
                    </div>

                    <div className="space-y-5">
                        {[
                            "Auto low-stock alerts to admin (under 10 units)",
                            "AI predicts vehicle part failures before they happen",
                            "10% loyalty discount on purchases over Rs. 5000",
                            "Email reminders for overdue credit payments",
                            "Daily, monthly and yearly financial reports",
                        ].map((f) => (
                            <div
                                key={f}
                                className="flex items-start gap-4 border-b border-[oklch(0.88_0.012_80)] pb-5"
                            >
                                <div className="h-7 w-7 rounded-full bg-[oklch(0.74_0.16_65)] text-[oklch(0.18_0.012_60)] grid place-items-center text-xs font-bold shrink-0 mt-0.5">
                                    ✓
                                </div>
                                <span className="text-base text-[oklch(0.205_0.012_60)]">{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}