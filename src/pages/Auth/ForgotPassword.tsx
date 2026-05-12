import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPassword() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="grid min-h-screen place-items-center px-6">
                <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-sm">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to login
                    </Link>

                    <div className="mt-8 grid h-14 w-14 place-items-center rounded-2xl bg-accent/15 text-accent">
                        <Mail className="h-6 w-6" />
                    </div>

                    <h1 className="mt-6 text-3xl font-bold tracking-tight">
                        Password help
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        Contact the service desk to reset your account password. For coursework demo accounts, you can also register a new customer account and sign in with it immediately.
                    </p>

                    <div className="mt-8 space-y-3 rounded-2xl bg-muted p-5 text-sm">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Phone</span>
                            <span className="font-semibold">9800000000</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Email</span>
                            <span className="font-semibold">support@axleworks.local</span>
                        </div>
                    </div>

                    <Link
                        to="/register"
                        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-foreground py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-background transition hover:opacity-90"
                    >
                        Create new account
                    </Link>
                </div>
            </div>
        </div>
    );
}
