import { Link } from "react-router-dom";
import {
    FaCar,
    FaTools,
    FaShoppingCart,
    FaStar,
    FaShieldAlt,
    FaArrowRight,
    FaUsers,
    FaCheckCircle,

} from "react-icons/fa";

import heroImg from "../assets/hero-image.jpg";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomePage() {
    const services = [
        {
            icon: <FaTools />,
            title: "Vehicle Repair",
            desc: "Professional repair services for all vehicle brands.",
        },
        {
            icon: <FaShoppingCart />,
            title: "Genuine Parts",
            desc: "Buy authentic spare parts with warranty.",
        },
        {
            icon: <FaCar />,
            title: "Vehicle Inspection",
            desc: "Complete diagnostics and performance checks.",
        },
    ];

    const features = [
        "Trusted by 10,000+ Customers",
        "Certified Mechanics",
        "100% Genuine Parts",
        "Fast Delivery & Service",
        "Modern Inventory System",
        "Affordable Pricing",
    ];

    const reviews = [
        {
            name: "Rahul Sharma",
            msg: "Excellent service and original parts. Highly recommended.",
        },
        {
            name: "Sujan Pandit",
            msg: "Best workshop experience. Friendly staff and quick service.",
        },
        {
            name: "Kriti Tripathi",
            msg: "Very clean system and easy booking process.",
        },
    ];

    return (
        <div className="bg-slate-950 text-white min-h-screen">
            {/* Navbar */}
            <Header />

            {/* Hero */}
            <section
                id="home"
                className="relative min-h-screen flex items-center pt-16"
            >
                <img
                    src={heroImg}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/40" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-400 text-sm mb-6">
                            <FaShieldAlt />
                            Trusted Auto Service Center
                        </span>

                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                            Premium Car Parts <br />
                            <span className="text-cyan-400">& Vehicle Care</span>
                        </h1>

                        <p className="text-gray-300 text-lg mb-8 max-w-xl">
                            Buy genuine spare parts, book repair services, manage invoices,
                            customers, and inventory — all in one smart system.
                        </p>

                        <div className="flex gap-4 flex-wrap">
                            <Link
                                to="/login"
                                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-semibold flex items-center gap-2"
                            >
                                Get Started <FaArrowRight />
                            </Link>

                            <a
                                href="#services"
                                className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/10"
                            >
                                Explore Services
                            </a>
                        </div>

                        <div className="grid grid-cols-3 gap-6 mt-10">
                            <div>
                                <h3 className="text-2xl font-bold">15+</h3>
                                <p className="text-gray-400 text-sm">Years Experience</p>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold">50K+</h3>
                                <p className="text-gray-400 text-sm">Parts Available</p>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold">4.9★</h3>
                                <p className="text-gray-400 text-sm">Customer Rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section id="services" className="py-24 bg-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-bold">Our Services</h2>
                        <p className="text-gray-400 mt-3">
                            Complete solutions for vehicle owners
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((item, i) => (
                            <div
                                key={i}
                                className="p-8 rounded-2xl bg-slate-800 border border-white/10 hover:border-cyan-400 transition"
                            >
                                <div className="w-14 h-14 rounded-xl bg-cyan-500 flex items-center justify-center text-xl mb-5">
                                    {item.icon}
                                </div>

                                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section id="features" className="py-24 bg-slate-950">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14">
                    <div>
                        <h2 className="text-4xl font-bold mb-6">Why Choose Us?</h2>
                        <p className="text-gray-400 mb-8">
                            We provide reliable services, modern technology, and customer
                            satisfaction with transparent pricing.
                        </p>

                        <div className="grid gap-4">
                            {features.map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <FaCheckCircle className="text-cyan-400" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-10 border border-white/10">
                        <div className="grid grid-cols-2 gap-8 text-center">
                            <div>
                                <FaUsers className="mx-auto text-4xl text-cyan-400 mb-3" />
                                <h3 className="text-3xl font-bold">10K+</h3>
                                <p className="text-gray-400">Happy Clients</p>
                            </div>

                            <div>
                                <FaTools className="mx-auto text-4xl text-cyan-400 mb-3" />
                                <h3 className="text-3xl font-bold">500+</h3>
                                <p className="text-gray-400">Repairs Monthly</p>
                            </div>

                            <div>
                                <FaShoppingCart className="mx-auto text-4xl text-cyan-400 mb-3" />
                                <h3 className="text-3xl font-bold">50K+</h3>
                                <p className="text-gray-400">Parts Stock</p>
                            </div>

                            <div>
                                <FaStar className="mx-auto text-4xl text-cyan-400 mb-3" />
                                <h3 className="text-3xl font-bold">4.9</h3>
                                <p className="text-gray-400">Rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews */}
            <section id="reviews" className="py-24 bg-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-bold">Customer Reviews</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {reviews.map((item, i) => (
                            <div
                                key={i}
                                className="bg-slate-800 p-8 rounded-2xl border border-white/10"
                            >
                                <div className="flex gap-1 text-yellow-400 mb-4">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                </div>

                                <p className="text-gray-300 mb-5">"{item.msg}"</p>
                                <h4 className="font-semibold">{item.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
             <Footer />
        </div>
    );
}