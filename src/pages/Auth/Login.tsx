import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaEnvelope,
    FaLock,
    FaUserShield,
} from "react-icons/fa";

import { useAuth } from "../../context/useAuth";
import Logo from "../../components/Logo";
import type { AxiosError } from "axios";

export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [loading, setLoading] = useState(false);

    const submit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const user = await login(email, password);

            if (user.roles.includes("Admin")) {
                nav("/admin");
            } else if (user.roles.includes("Staff")) {
                nav("/staff");
            } else {
                nav("/customer");
            }
        } catch (error: unknown) {
            const err = error as AxiosError<{
                errors?: string[];
            }>;

            alert(
                err.response?.data?.errors?.[0] ||
                "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full -top-10 -left-10" />
            <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full bottom-0 right-0" />

            <div className="w-full max-w-md relative z-10">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-3 justify-center mb-8"
                >
                    <Logo className="w-12 h-12" />

                    <span className="font-bold text-2xl text-white">
                        VehicleParts
                    </span>
                </Link>

                {/* Card */}
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 animate-fade-in">

                    <h1 className="text-2xl font-bold text-white mb-1">
                        Welcome Back
                    </h1>

                    <p className="text-sm text-gray-400 mb-6">
                        Sign in to access your dashboard
                    </p>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-4">

                        {/* Email */}
                        <div>
                            <label className="text-sm font-medium text-gray-300">
                                Email
                            </label>

                            <div className="relative mt-1">
                                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="admin@vehicleparts.com"
                                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-white/10 bg-slate-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-sm font-medium text-gray-300">
                                Password
                            </label>

                            <div className="relative mt-1">
                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-white/10 bg-slate-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                        </div>

                        {/* Remember */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-400">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) =>
                                        setRemember(e.target.checked)
                                    }
                                />
                                Remember me
                            </label>

                            <Link
                                to="/forgot-password"
                                className="text-cyan-400 font-medium hover:underline"
                            >
                                Forgot?
                            </Link>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 transition"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    {/* Demo */}
                    <div className="mt-6 p-4 rounded-xl bg-slate-800/70 text-xs text-gray-400 flex items-start gap-3 border border-white/10">
                        <FaUserShield className="mt-0.5 text-cyan-400 shrink-0" />

                        <div>
                            <strong className="text-white">
                                Demo:
                            </strong>{" "}
                            admin = Admin, staff = Staff, others = Customer
                        </div>
                    </div>

                    {/* Register */}
                    <p className="text-center text-sm text-gray-400 mt-6">
                        Don’t have an account?{" "}
                        <Link
                            to="/register"
                            className="text-cyan-400 font-semibold hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}