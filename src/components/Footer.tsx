import { Link } from "react-router-dom";
import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
} from "react-icons/fa";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer
            id="contact"
            className="bg-black border-t border-white/10 text-gray-300 py-12"
        >
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">

                {/* Brand */}
                <div className="flex items-center gap-3 mb-3">
                    <Logo className="w-10 h-10" iconOnly />
                    <span
                        className="text-white font-semibold text-lg"
                        style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}
                    >
                        Auto<span className="text-cyan-400">Core</span>
                    </span>
                </div>

                {/* Links */}
                <div>
                    <h4 className="font-semibold text-white mb-3">Quick Links</h4>

                    <ul className="space-y-2 text-sm">
                        <li>
                            <a href="#home" className="hover:text-cyan-400 transition">
                                Home
                            </a>
                        </li>

                        <li>
                            <a href="#services" className="hover:text-cyan-400 transition">
                                Services
                            </a>
                        </li>

                        <li>
                            <Link to="/login" className="hover:text-cyan-400 transition">
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-semibold text-white mb-3">Contact</h4>

                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <FaPhoneAlt />
                            +977 9800000000
                        </li>

                        <li className="flex items-center gap-2">
                            <FaEnvelope />
                            info@vehicleparts.com
                        </li>

                        <li className="flex items-center gap-2">
                            <FaMapMarkerAlt />
                            Kathmandu, Nepal
                        </li>
                    </ul>
                </div>

                {/* Hours */}
                <div>
                    <h4 className="font-semibold text-white mb-3">Working Hours</h4>

                    <ul className="space-y-1 text-sm">
                        <li>Mon - Fri : 8AM - 6PM</li>
                        <li>Saturday : 9AM - 2PM</li>
                        <li>Sunday : Closed</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-gray-500">
                © 2026 VehicleParts. All rights reserved.
            </div>
        </footer>
    );
}