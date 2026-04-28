import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <Logo className="w-10 h-10" iconOnly />
                    <span className="text-white font-semibold text-lg">
                        Auto<span className="text-cyan-400">Core</span>
                    </span>
                </Link>

                {/* Nav */}
                <nav className="hidden md:flex gap-8 text-sm text-gray-300">
                    <a href="#home" className="hover:text-cyan-400 transition">Home</a>
                    <a href="#services" className="hover:text-cyan-400 transition">Services</a>
                    <a href="#features" className="hover:text-cyan-400 transition">Why Us</a>
                    <a href="#reviews" className="hover:text-cyan-400 transition">Reviews</a>
                    <a href="#contact" className="hover:text-cyan-400 transition">Contact</a>
                </nav>

                {/* Buttons */}
                <div className="flex gap-3">
                    <Link
                        to="/login"
                        className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-white"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </header>
    );
}