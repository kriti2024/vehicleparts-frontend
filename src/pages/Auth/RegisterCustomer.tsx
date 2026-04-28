import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaUser,
    FaPhone,
    FaEnvelope,
    FaLock,
    FaCar,
} from "react-icons/fa";

import Logo from "../../components/Logo";

export default function CustomerSignup() {
    const nav = useNavigate();

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirm: "",
        vehicleNumber: "",
        brand: "",
        model: "",
        year: "",
    });

    const [loading, setLoading] = useState(false);

    const onChange = (
        key: string,
        value: string
    ) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();

        if (form.password !== form.confirm) {
            alert("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            // API later
            setTimeout(() => {
                nav("/login");
            }, 1000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10 relative overflow-hidden">

            {/* Glow */}
            <div className="absolute w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full top-0 left-0" />
            <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full bottom-0 right-0" />

            <div className="w-full max-w-3xl relative z-10">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-3 justify-center mb-8"
                >
                    <Logo className="w-12 h-12" />

                    <span className="text-2xl font-bold text-white">
                        VehicleParts
                    </span>
                </Link>

                {/* Card */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">

                    <h1 className="text-2xl font-bold text-white mb-1">
                        Create Account
                    </h1>

                    <p className="text-sm text-gray-400 mb-8">
                        Add your personal and vehicle details
                    </p>

                    <form
                        onSubmit={submit}
                        className="space-y-8"
                    >

                        {/* Personal Info */}
                        <div>
                            <h2 className="text-white font-semibold mb-4">
                                Personal Info
                            </h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <Field
                                    icon={<FaUser />}
                                    placeholder="Full Name"
                                    value={form.name}
                                    onChange={(v) =>
                                        onChange("name", v)
                                    }
                                />

                                <Field
                                    icon={<FaPhone />}
                                    placeholder="Phone"
                                    value={form.phone}
                                    onChange={(v) =>
                                        onChange("phone", v)
                                    }
                                />

                                <Field
                                    icon={<FaEnvelope />}
                                    placeholder="Email"
                                    type="email"
                                    value={form.email}
                                    onChange={(v) =>
                                        onChange("email", v)
                                    }
                                />

                                <Field
                                    icon={<FaLock />}
                                    placeholder="Password"
                                    type="password"
                                    value={form.password}
                                    onChange={(v) =>
                                        onChange("password", v)
                                    }
                                />

                                <Field
                                    icon={<FaLock />}
                                    placeholder="Confirm Password"
                                    type="password"
                                    value={form.confirm}
                                    onChange={(v) =>
                                        onChange("confirm", v)
                                    }
                                />
                            </div>
                        </div>

                        {/* Vehicle Info */}
                        <div>
                            <h2 className="text-white font-semibold mb-4">
                                Vehicle Info
                            </h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <Field
                                    icon={<FaCar />}
                                    placeholder="Vehicle Number"
                                    value={form.vehicleNumber}
                                    onChange={(v) =>
                                        onChange(
                                            "vehicleNumber",
                                            v
                                        )
                                    }
                                />

                                <Field
                                    icon={<FaCar />}
                                    placeholder="Brand"
                                    value={form.brand}
                                    onChange={(v) =>
                                        onChange("brand", v)
                                    }
                                />

                                <Field
                                    icon={<FaCar />}
                                    placeholder="Model"
                                    value={form.model}
                                    onChange={(v) =>
                                        onChange("model", v)
                                    }
                                />

                                <Field
                                    icon={<FaCar />}
                                    placeholder="Year"
                                    value={form.year}
                                    onChange={(v) =>
                                        onChange("year", v)
                                    }
                                />
                            </div>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 transition"
                        >
                            {loading
                                ? "Creating..."
                                : "Create Account"}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-400 mt-6">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-cyan-400 font-semibold hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ---------------- FIELD ---------------- */

function Field({
    icon,
    placeholder,
    value,
    onChange,
    type = "text",
}: {
    icon: React.ReactNode;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
}) {
    return (
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                {icon}
            </div>

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
        </div>
    );
}