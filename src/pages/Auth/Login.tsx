import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../../components/Logo";
import heroCar from "../../assets/hero-car.jpg";
import { useState } from "react";
import { useAuth } from "../../context/useAuth";

export default function LoginPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const registeredEmail =
        (location.state as { registeredEmail?: string } | null)
            ?.registeredEmail ?? "";

    const [email, setEmail] = useState(registeredEmail);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {

            const user = await login(
                email.trim(),
                password
            );

            if (user.roles.includes("Admin")) {
                navigate("/admin/dashboard");
            }
            else if (user.roles.includes("Staff")) {
                navigate("/staff/dashboard");
            }
            else {
                navigate("/customer/dashboard");
            }

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to sign in. Please try again."
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
                            Premium Vehicle Platform
                        </div>

                        <h1 className="text-6xl font-bold leading-[0.95] tracking-tight">
                            Welcome
                            <br />
                            back.
                        </h1>

                        <p className="mt-8 text-lg text-white/70 leading-relaxed">
                            Manage vehicle services, parts inventory,
                            invoices, customer operations and analytics —
                            all in one luxury platform.
                        </p>
                    </div>

                    <div className="text-sm text-white/40 tracking-[0.2em] uppercase">
                        Axleworks © 2026
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">

                    <div className="lg:hidden mb-10">
                        <Logo />
                    </div>

                    <Link
                        to="/"
                        className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground transition"
                    >
                        ← Back home
                    </Link>

                    <div className="mt-8 rounded-3xl border border-border bg-card/80 backdrop-blur p-8 shadow-2xl">

                        <h2 className="text-4xl font-bold tracking-tight">
                            Sign in
                        </h2>

                        <p className="mt-3 text-muted-foreground">
                            Use the email and password from your registered account.
                        </p>

                        {registeredEmail && (
                            <div className="mt-5 rounded-2xl border border-[oklch(0.84_0.1_130)] bg-[oklch(0.94_0.05_130)] px-4 py-3 text-sm font-medium">
                                Account created. Sign in to continue.
                            </div>
                        )}

                        <form
                            onSubmit={handleLogin}
                            className="mt-8 space-y-5"
                        >
                            {error && (
                                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            {/* EMAIL */}
                            <div>
                                <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
                                />
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
                                />
                            </div>

                            {/* REMEMBER */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-muted-foreground">
                                    <input type="checkbox" />
                                    Remember me
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="text-accent hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* BUTTON */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-xl bg-foreground text-background py-3.5 text-xs font-semibold tracking-[0.25em] uppercase transition hover:opacity-90"
                            >
                                {submitting ? "Signing In..." : "Sign In"}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-accent hover:underline"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

