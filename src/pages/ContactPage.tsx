import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

import { SiteHeader } from "../components/SiteHeader";
import { Footer } from "../components/Footer";

const contactItems = [
    { icon: Phone, label: "Phone", value: "9800000000" },
    { icon: Mail, label: "Email", value: "support@axleworks.local" },
    { icon: MapPin, label: "Location", value: "Kathmandu, Nepal" },
];

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[oklch(0.965_0.012_85)] text-[oklch(0.205_0.012_60)]">
            <SiteHeader />

            <main className="px-6 pb-24 pt-36">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
                    <section>
                        <div className="text-[11px] uppercase tracking-[0.35em] text-[oklch(0.48_0.04_65)]">
                            Contact
                        </div>
                        <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-7xl">
                            We are ready to help.
                        </h1>
                        <p className="mt-5 max-w-2xl text-[oklch(0.48_0.015_70)]">
                            Reach the service desk for bookings, part requests, invoice help, or account support.
                        </p>

                        <div className="mt-10 grid gap-4 md:grid-cols-3">
                            {contactItems.map((item) => (
                                <div key={item.label} className="rounded-3xl border border-[oklch(0.88_0.012_80)] bg-white p-6">
                                    <item.icon className="h-6 w-6 text-[oklch(0.58_0.16_75)]" />
                                    <div className="mt-5 text-[10px] uppercase tracking-[0.24em] text-[oklch(0.5_0.012_70)]">
                                        {item.label}
                                    </div>
                                    <div className="mt-2 font-bold">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-3xl border border-[oklch(0.88_0.012_80)] bg-white p-7">
                        <h2 className="text-2xl font-bold tracking-tight">Start online</h2>
                        <p className="mt-3 text-sm leading-6 text-[oklch(0.48_0.015_70)]">
                            Customers can register a vehicle, book service, request parts, and track invoices from the customer workspace.
                        </p>
                        <div className="mt-8 space-y-3">
                            <Link
                                to="/register"
                                className="inline-flex w-full items-center justify-between rounded-2xl bg-[oklch(0.235_0.012_60)] px-5 py-4 text-sm font-bold text-white transition hover:opacity-90"
                            >
                                Create account
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex w-full items-center justify-between rounded-2xl border border-[oklch(0.88_0.012_80)] px-5 py-4 text-sm font-bold transition hover:bg-[oklch(0.94_0.01_80)]"
                            >
                                Sign in
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
