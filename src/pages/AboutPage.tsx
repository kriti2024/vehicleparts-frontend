import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { Footer } from "../components/Footer";
import heroCar from "../assets/hero-car.jpg";

import {
    ArrowUpRight,
    ShieldCheck,
    Sparkles,
    Gauge,
} from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[oklch(0.965_0.012_85)] text-[oklch(0.205_0.012_60)] overflow-hidden">

            <SiteHeader />

            {/* HERO */}
            <section className="relative min-h-[80vh] flex items-center justify-center">

                <img
                    src={heroCar}
                    alt="Vehicle"
                    className="absolute inset-0 h-full w-full object-cover opacity-90"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.965_0.012_85)]/30 via-transparent to-[oklch(0.965_0.012_85)]" />

                <div className="relative z-10 text-center px-6 pt-24">

                    <div className="text-[11px] tracking-[0.35em] uppercase text-[oklch(0.205_0.012_60)]/60">
                        About Axleworks
                    </div>

                    <h1 className="mt-6 text-[16vw] md:text-[7rem] font-black tracking-tighter leading-[0.85] text-[oklch(0.205_0.012_60)]">
                        ENGINEERED
                        <br />
                        FOR THE
                        <br />
                        <span className="text-[oklch(0.74_0.16_65)]">
                            FUTURE
                        </span>
                    </h1>

                    <p className="mt-8 max-w-3xl mx-auto text-base md:text-lg text-[oklch(0.205_0.012_60)]/70 leading-relaxed">
                        Axleworks is a premium vehicle parts and service
                        management platform designed for modern automotive
                        businesses — combining intelligent automation,
                        streamlined operations, and luxury user experience.
                    </p>
                </div>
            </section>

            {/* STORY */}
            <section className="py-28 px-6">

                <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-20 items-center">

                    <div>

                        <div className="text-[11px] tracking-[0.35em] uppercase text-[oklch(0.5_0.012_70)]">
                            Our Vision
                        </div>

                        <h2 className="mt-5 text-5xl md:text-6xl font-bold tracking-tight leading-tight text-[oklch(0.205_0.012_60)]">
                            We make vehicle
                            management effortless.
                        </h2>

                        <p className="mt-8 text-lg leading-relaxed text-[oklch(0.205_0.012_60)]/75">
                            Built around three powerful workspaces — Admin,
                            Staff and Customer — Axleworks transforms
                            traditional vehicle service workflows into one
                            intelligent ecosystem.
                        </p>

                        <p className="mt-6 leading-relaxed text-[oklch(0.5_0.012_70)]">
                            From inventory management and invoice generation
                            to AI-powered failure prediction and customer
                            analytics, every feature is engineered to reduce
                            friction and improve operational efficiency.
                        </p>

                        <div className="mt-10 flex flex-wrap gap-4">

                            <Link
                                to="/services"
                                className="rounded-full bg-[oklch(0.235_0.012_60)] text-[oklch(0.97_0.012_85)] px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[oklch(0.205_0.012_60)] transition inline-flex items-center gap-2"
                            >
                                Explore Services
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-full border border-[oklch(0.205_0.012_60)]/20 px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[oklch(0.205_0.012_60)]/5 transition"
                            >
                                Join Platform
                            </Link>
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="grid sm:grid-cols-2 gap-6">

                        {[
                            {
                                number: "2018",
                                label: "Founded",
                            },
                            {
                                number: "15K+",
                                label: "Customers Served",
                            },
                            {
                                number: "42",
                                label: "Service Bays",
                            },
                            {
                                number: "99.9%",
                                label: "Service Rating",
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="rounded-3xl border border-[oklch(0.88_0.012_80)] bg-[oklch(0.985_0.008_85)] p-8 transition hover:border-[oklch(0.74_0.16_65)]"
                            >

                                <div className="text-5xl font-bold text-[oklch(0.74_0.16_65)]">
                                    {item.number}
                                </div>

                                <div className="mt-4 text-xs uppercase tracking-[0.25em] text-[oklch(0.5_0.012_70)]">
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="py-28 px-6 bg-[oklch(0.92_0.014_80)] border-y border-[oklch(0.88_0.012_80)]">

                <div className="mx-auto max-w-7xl">

                    <div className="text-center">

                        <div className="text-[11px] tracking-[0.35em] uppercase text-[oklch(0.5_0.012_70)]">
                            Why Axleworks
                        </div>

                        <h2 className="mt-5 text-5xl md:text-6xl font-bold tracking-tight text-[oklch(0.205_0.012_60)]">
                            Built beyond expectations.
                        </h2>
                    </div>

                    <div className="mt-20 grid md:grid-cols-3 gap-6">

                        {[
                            {
                                icon: Gauge,
                                title: "Modern Workflow",
                                desc: "Fast, seamless and optimized service management built for modern operations.",
                            },
                            {
                                icon: ShieldCheck,
                                title: "Reliable Systems",
                                desc: "Inventory, invoices, analytics and customer operations unified in one secure platform.",
                            },
                            {
                                icon: Sparkles,
                                title: "AI Powered",
                                desc: "Predictive maintenance and intelligent insights help prevent failures before they happen.",
                            },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-3xl border border-[oklch(0.88_0.012_80)] bg-[oklch(0.985_0.008_85)] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[oklch(0.74_0.16_65)]"
                            >

                                <div className="h-14 w-14 rounded-2xl bg-[oklch(0.74_0.16_65)]/10 border border-[oklch(0.74_0.16_65)]/20 flex items-center justify-center">
                                    <feature.icon className="h-7 w-7 text-[oklch(0.74_0.16_65)]" />
                                </div>

                                <h3 className="mt-8 text-2xl font-semibold tracking-tight text-[oklch(0.205_0.012_60)]">
                                    {feature.title}
                                </h3>

                                <p className="mt-4 leading-relaxed text-[oklch(0.5_0.012_70)]">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-28 px-6">

                <div className="mx-auto max-w-5xl text-center">

                    <div className="text-[11px] tracking-[0.35em] uppercase text-[oklch(0.5_0.012_70)]">
                        Start Today
                    </div>

                    <h2 className="mt-5 text-5xl md:text-6xl font-bold tracking-tight leading-tight text-[oklch(0.205_0.012_60)]">
                        Ready to experience
                        the future of vehicle care?
                    </h2>

                    <p className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed text-[oklch(0.5_0.012_70)]">
                        Join thousands of customers and automotive professionals
                        already using Axleworks to streamline service operations.
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