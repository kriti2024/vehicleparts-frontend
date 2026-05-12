import { Link } from "react-router-dom";
import { ArrowUpRight, BadgeCheck, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { SiteHeader } from "../components/SiteHeader";
import { Footer } from "../components/Footer";
import brakePadImage from "../assets/parts/brake-pad.png";
import engineOilImage from "../assets/parts/engine-oil.jpg";
import sparkPlugImage from "../assets/parts/spark-plug.jpg";
import airFilterImage from "../assets/parts/air-filter.svg";
import clutchPlateImage from "../assets/parts/clutch-plate.svg";
import alloyWheelImage from "../assets/parts/alloy-wheel.svg";
import carBatteryImage from "../assets/parts/car-battery.svg";
import radiatorImage from "../assets/parts/radiator.svg";
import headlightImage from "../assets/parts/headlight.svg";
import tireImage from "../assets/parts/tire.svg";
import fuelFilterImage from "../assets/parts/fuel-filter.svg";
import wiperBladeImage from "../assets/parts/wiper-blade.svg";
import shockAbsorberImage from "../assets/parts/shock-absorber.svg";
import alternatorImage from "../assets/parts/alternator.svg";
import timingBeltImage from "../assets/parts/timing-belt.svg";

const parts = [
    { name: "Brake Pad", price: 3200, stock: 18, fitment: "Toyota / Honda - Sedan and compact SUV", image: brakePadImage },
    { name: "Engine Oil", price: 1850, stock: 26, fitment: "Multi-brand - Petrol engines", image: engineOilImage },
    { name: "Spark Plug", price: 950, stock: 34, fitment: "Nissan / Hyundai - 1.2L to 1.8L engines", image: sparkPlugImage },
    { name: "Air Filter", price: 780, stock: 12, fitment: "Universal - Most passenger vehicles", image: airFilterImage },
    { name: "Clutch Plate", price: 4200, stock: 9, fitment: "Toyota / Suzuki - Manual transmission", image: clutchPlateImage },
    { name: "Alloy Wheel", price: 8500, stock: 16, fitment: "Universal - 15 to 17 inch fitment", image: alloyWheelImage },
    { name: "Car Battery", price: 7600, stock: 14, fitment: "Multi-brand - 12V passenger vehicles", image: carBatteryImage },
    { name: "Radiator", price: 9800, stock: 8, fitment: "Toyota / Nissan - Sedan and SUV cooling system", image: radiatorImage },
    { name: "Headlight", price: 5200, stock: 20, fitment: "Hyundai / Suzuki - Front lighting assembly", image: headlightImage },
    { name: "Tire", price: 6900, stock: 24, fitment: "Universal - Passenger vehicle tire", image: tireImage },
    { name: "Fuel Filter", price: 1450, stock: 17, fitment: "Multi-brand - Petrol and diesel engines", image: fuelFilterImage },
    { name: "Wiper Blade", price: 1200, stock: 30, fitment: "Universal - Front windshield", image: wiperBladeImage },
    { name: "Shock Absorber", price: 6400, stock: 10, fitment: "Toyota / Hyundai - Suspension system", image: shockAbsorberImage },
    { name: "Alternator", price: 11800, stock: 7, fitment: "Multi-brand - Charging system", image: alternatorImage },
    { name: "Timing Belt", price: 3600, stock: 15, fitment: "Honda / Nissan - Engine timing system", image: timingBeltImage },
];

export default function PartsCatalogPage() {
    const [query, setQuery] = useState("");
    const filteredParts = parts.filter((part) =>
        `${part.name} ${part.fitment}`.toLowerCase().includes(query.trim().toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[oklch(0.965_0.012_85)] text-[oklch(0.205_0.012_60)]">
            <SiteHeader />

            <section className="px-6 pb-16 pt-36">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.35em] text-[oklch(0.48_0.04_65)]">
                                Parts Catalog
                            </div>
                            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-7xl">
                                Genuine parts, ready now.
                            </h1>
                            <p className="mt-5 max-w-2xl text-[oklch(0.48_0.015_70)]">
                                Browse stocked vehicle parts with clear photos, fitment details, and current availability.
                            </p>
                        </div>

                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.235_0.012_60)] px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:opacity-90"
                        >
                            Request Part
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <label className="mt-10 flex max-w-2xl items-center gap-3 rounded-2xl border border-[oklch(0.88_0.012_80)] bg-white px-4 py-3">
                        <Search className="h-4 w-4 text-[oklch(0.48_0.012_70)]" />
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search by part or vehicle"
                            className="w-full bg-transparent text-sm outline-none placeholder:text-[oklch(0.58_0.012_70)]"
                        />
                    </label>
                </div>
            </section>

            <section className="px-6 pb-24">
                <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredParts.map((part) => (
                        <article
                            key={part.name}
                            className="overflow-hidden rounded-3xl border border-[oklch(0.88_0.012_80)] bg-[oklch(0.985_0.008_85)] shadow-sm"
                        >
                            <div className="relative aspect-[4/3] bg-[oklch(0.94_0.01_80)]">
                                <img src={part.image} alt={part.name} className="h-full w-full object-cover" />
                                <div className="absolute left-4 top-4 rounded-full bg-[oklch(0.95_0.045_145)] px-3 py-1 text-xs font-semibold text-[oklch(0.36_0.10_145)]">
                                    {part.stock} in stock
                                </div>
                            </div>

                            <div className="space-y-4 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight">{part.name}</h2>
                                        <p className="mt-2 text-sm text-[oklch(0.48_0.015_70)]">{part.fitment}</p>
                                    </div>
                                    <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-[oklch(0.58_0.16_75)]" />
                                </div>

                                <div className="flex items-center justify-between rounded-2xl bg-white p-4">
                                    <span className="text-sm text-[oklch(0.5_0.012_70)]">Price</span>
                                    <span className="font-bold">Rs. {part.price}</span>
                                </div>

                                <Link
                                    to="/login"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[oklch(0.72_0.15_72)] px-5 py-3 text-sm font-bold text-[oklch(0.16_0.01_60)] transition hover:bg-[oklch(0.68_0.16_68)]"
                                >
                                    <ShieldCheck className="h-4 w-4" />
                                    Sign in to request
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
