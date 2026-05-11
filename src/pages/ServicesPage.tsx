import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { Footer } from "../components/Footer";
import heroCar from "../assets/hero-car.jpg";

import {
    Wrench,
    Battery,
    Gauge,
    ShieldCheck,
    Cog,
    Sparkles,
    ArrowUpRight,
} from "lucide-react";

const services = [
    {
        icon: Wrench,
        title: "General Repair",
        desc: "Engine, suspension, transmission and complete mechanical solutions.",
    },
    {
        icon: Battery,
        title: "EV Diagnostics",
        desc: "Advanced battery analytics and electric powertrain diagnostics.",
    },
    {
        icon: Gauge,
        title: "Performance Tuning",
        desc: "Precision ECU tuning and intelligent drive optimization.",
    },
    {
        icon: ShieldCheck,
        title: "Safety Inspection",
        desc: "Complete 120-point inspection with digital safety reporting.",
    },
    {
        icon: Cog,
        title: "Genuine Parts",
        desc: "OEM and premium aftermarket parts always available in stock.",
    },
    {
        icon: Sparkles,
        title: "AI Predictive Care",
        desc: "AI-powered part failure prediction before breakdown occurs.",
    },
];

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-[oklch(0.965_0.012_85)] text-[oklch(0.205_0.012_60)] overflow-hidden">

            <SiteHeader />

            {/* HERO */}
            <section className="relative min-h-[75vh] flex items-center justify-center">

                <img
                    src={heroCar}
                    alt="Vehicle"
                    className="absolute inset-0 h-full w-full object-cover opacity-90"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.965_0.012_85)]/30 via-transparent to-[oklch(0.965_0.012_85)]" />

                <div className="relative z-10 text-center px-6 pt-24">

                    <div className="text-[11px] tracking-[0.35em] uppercase text-[oklch(0.205_0.012_60)]/60">
                        Premium Automotive Solutions
                    </div>

                    <h1 className="mt-6 text-[16vw] md:text-[7rem] font-black tracking-tighter leading-[0.85] text-[oklch(0.205_0.012_60)]">
                        SERVICE
                        <br />
                        <span className="text-[oklch(0.74_0.16_65)]">
                            REDEFINED
                        </span>
                    </h1>

                    <p className="mt-8 max-w-2xl mx-auto text-[oklch(0.205_0.012_60)]/70 leading-relaxed text-base md:text-lg">
                        From intelligent diagnostics to premium repair workflows,
                        Axleworks delivers luxury-grade vehicle servicing powered
                        by precision engineering and automation.
                    </p>

                    <div className="mt-10 flex flex-wrap justify-center gap-4">

                        <Link
                            to="/register"
                            className="rounded-full bg-[oklch(0.235_0.012_60)] text-[oklch(0.97_0.012_85)] px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[oklch(0.205_0.012_60)] transition-all inline-flex items-center gap-2"
                        >
                            Book Service
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>

                        <Link
                            to="/login"
                            className="rounded-full border border-[oklch(0.205_0.012_60)]/20 px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[oklch(0.205_0.012_60)]/5 transition"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section className="py-28 px-6">

                <div className="mx-auto max-w-7xl">

                    <div className="text-center">

                        <div className="text-[11px] tracking-[0.35em] uppercase text-[oklch(0.5_0.012_70)]">
                            What We Offer
                        </div>

                        <h2 className="mt-4 text-5xl md:text-6xl font-bold tracking-tight text-[oklch(0.205_0.012_60)]">
                            Built for modern vehicles.
                        </h2>

                        <p className="mt-6 max-w-2xl mx-auto text-[oklch(0.5_0.012_70)] leading-relaxed">
                            Every workflow is optimized for performance,
                            transparency and reliability — from booking to invoice.
                        </p>
                    </div>

                    <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {services.map((service) => (
                            <div
                                key={service.title}
                                className="group rounded-3xl border border-[oklch(0.88_0.012_80)] bg-[oklch(0.985_0.008_85)] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[oklch(0.74_0.16_65)]"
                            >

                                <div className="h-14 w-14 rounded-2xl bg-[oklch(0.74_0.16_65)]/10 border border-[oklch(0.74_0.16_65)]/20 flex items-center justify-center">
                                    <service.icon className="h-7 w-7 text-[oklch(0.74_0.16_65)]" />
                                </div>

                                <h3 className="mt-8 text-2xl font-semibold tracking-tight text-[oklch(0.205_0.012_60)]">
                                    {service.title}
                                </h3>

                                <p className="mt-4 text-sm leading-relaxed text-[oklch(0.5_0.012_70)]">
                                    {service.desc}
                                </p>

                                <div className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[oklch(0.205_0.012_60)] group-hover:text-[oklch(0.74_0.16_65)] transition">
                                    Learn More
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-28 px-6 bg-[oklch(0.92_0.014_80)] border-y border-[oklch(0.88_0.012_80)]">

                <div className="mx-auto max-w-5xl text-center">

                    <div className="text-[11px] tracking-[0.35em] uppercase text-[oklch(0.5_0.012_70)]">
                        Experience Axleworks
                    </div>

                    <h2 className="mt-5 text-5xl md:text-6xl font-bold tracking-tight leading-tight text-[oklch(0.205_0.012_60)]">
                        Ready to transform
                        <br />
                        your vehicle experience?
                    </h2>

                    <p className="mt-6 max-w-2xl mx-auto leading-relaxed text-[oklch(0.5_0.012_70)]">
                        Register your vehicle, book services,
                        monitor repairs and manage invoices from one seamless platform.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">

                        <Link
                            to="/register"
                            className="rounded-full bg-[oklch(0.235_0.012_60)] text-[oklch(0.97_0.012_85)] px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[oklch(0.205_0.012_60)] transition"
                        >
                            Create Account
                        </Link>

                        <Link
                            to="/login"
                            className="rounded-full border border-[oklch(0.205_0.012_60)]/20 px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[oklch(0.205_0.012_60)]/5 transition"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}