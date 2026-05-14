import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Logo } from "../../components/Logo";
import heroCar from "../../assets/hero-car.jpg";
import { registerCustomer } from "../../api/customer";

export default function RegisterCustomer() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        vehicleNumber: "",
        vehicleModel: "",
        vehicleBrand: "",
        vehicleYear: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            await registerCustomer(formData);
            navigate("/login", {
                state: {
                    registeredEmail: formData.email.trim(),
                },
            });
        } catch (error) {
            setError(
                axios.isAxiosError(error)
                    ? error.response?.data?.message
                    ?? error.response?.data?.title
                    ?? "Unable to register customer. Please check your details and try again."
                    : "Unable to register customer. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background">

            {/* LEFT SIDE */}
            <div className="hidden lg:block relative overflow-hidden">
                <img
                    src={heroCar}
                    alt="Vehicle"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

                <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
                    <Logo dark />

                    <div className="max-w-lg">
                        <div className="text-[11px] tracking-[0.35em] uppercase text-white/60 mb-6">
                            Customer Registration
                        </div>

                        <h1 className="text-6xl font-bold leading-[0.95] tracking-tight">
                            Join
                            <br />
                            Axleworks.
                        </h1>

                        <p className="mt-8 text-lg text-white/70 leading-relaxed">
                            Create your customer account to manage vehicle
                            services, booking history, invoices, and part
                            requests in one modern platform.
                        </p>
                    </div>

                    <div className="text-sm text-white/40 tracking-[0.2em] uppercase">
                        Axleworks 2026
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-2xl">

                    <div className="lg:hidden mb-10">
                        <Logo />
                    </div>

                    <Link
                        to="/"
                        className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground transition"
                    >
                        Back home
                    </Link>

                    <div className="mt-8 rounded-3xl border border-border bg-card/80 backdrop-blur p-8 shadow-2xl">

                        <h2 className="text-4xl font-bold tracking-tight">
                            Register
                        </h2>

                        <p className="mt-3 text-muted-foreground">
                            Create your customer account and register your vehicle.
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-10 space-y-6"
                        >

                            {/* PERSONAL INFO */}
                            <div>
                                <h3 className="text-sm font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-5">
                                    Personal Information
                                </h3>

                                <div className="grid md:grid-cols-2 gap-5">

                                    {/* Full Name */}
                                    <div className="md:col-span-2">
                                        <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your full name"
                                            className="mt-2 w-full rounded-2xl border border-input bg-background px-5 py-4 text-sm outline-none transition focus:ring-2 focus:ring-accent"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your email"
                                            className="mt-2 w-full rounded-2xl border border-input bg-background px-5 py-4 text-sm outline-none transition focus:ring-2 focus:ring-accent"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                            Phone Number
                                        </label>

                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="98XXXXXXXX"
                                            className="mt-2 w-full rounded-2xl border border-input bg-background px-5 py-4 text-sm outline-none transition focus:ring-2 focus:ring-accent"
                                        />
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                            Password
                                        </label>

                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="Create password"
                                            className="mt-2 w-full rounded-2xl border border-input bg-background px-5 py-4 text-sm outline-none transition focus:ring-2 focus:ring-accent"
                                        />
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                            Confirm Password
                                        </label>

                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            placeholder="Confirm password"
                                            className="mt-2 w-full rounded-2xl border border-input bg-background px-5 py-4 text-sm outline-none transition focus:ring-2 focus:ring-accent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* VEHICLE INFO */}
                            <div className="pt-2">
                                <h3 className="text-sm font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-5">
                                    Vehicle Information
                                </h3>

                                <div className="grid md:grid-cols-2 gap-5">

                                    {/* Vehicle Number */}
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                            Vehicle Number
                                        </label>

                                        <input
                                            type="text"
                                            name="vehicleNumber"
                                            value={formData.vehicleNumber}
                                            onChange={handleChange}
                                            required
                                            placeholder="BA-01-PA-1234"
                                            className="mt-2 w-full rounded-2xl border border-input bg-background px-5 py-4 text-sm outline-none transition focus:ring-2 focus:ring-accent"
                                        />
                                    </div>

                                    {/* Vehicle Model */}
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                            Vehicle Model
                                        </label>

                                        <input
                                            type="text"
                                            name="vehicleModel"
                                            value={formData.vehicleModel}
                                            onChange={handleChange}
                                            required
                                            placeholder="Mustang GT"
                                            className="mt-2 w-full rounded-2xl border border-input bg-background px-5 py-4 text-sm outline-none transition focus:ring-2 focus:ring-accent"
                                        />
                                    </div>

                                    {/* Vehicle Brand */}
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                            Vehicle Brand
                                        </label>

                                        <input
                                            type="text"
                                            name="vehicleBrand"
                                            value={formData.vehicleBrand}
                                            onChange={handleChange}
                                            placeholder="Toyota, Honda..."
                                            className="mt-2 w-full rounded-2xl border border-input bg-background px-5 py-4 text-sm outline-none transition focus:ring-2 focus:ring-accent"
                                        />
                                    </div>

                                    {/* Vehicle Year */}
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                            Vehicle Year
                                        </label>

                                        <input
                                            type="number"
                                            name="vehicleYear"
                                            value={formData.vehicleYear}
                                            onChange={handleChange}
                                            placeholder="2024"
                                            className="mt-2 w-full rounded-2xl border border-input bg-background px-5 py-4 text-sm outline-none transition focus:ring-2 focus:ring-accent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* BUTTON */}
                            <div className="pt-4">
                                {error && (
                                    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full rounded-2xl bg-foreground text-background py-4 text-xs font-semibold tracking-[0.3em] uppercase transition hover:opacity-90"
                                >
                                    {submitting ? "Creating..." : "Create Account"}
                                </button>
                            </div>
                        </form>

                        <p className="mt-8 text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-accent hover:underline"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

