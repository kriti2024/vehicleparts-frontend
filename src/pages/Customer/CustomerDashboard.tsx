import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    BadgeCheck,
    Bell,
    Boxes,
    CalendarDays,
    Car,
    CheckCircle2,
    Clock,
    CreditCard,
    FileText,
    Gift,
    Headphones,
    History,
    LayoutDashboard,
    PackageSearch,
    Save,
    Search,
    Send,
    ShieldCheck,
    Star,
    Trash2,
    UserRound,
    Wrench,
    type LucideIcon,
} from "lucide-react";

import {
    addCustomerVehicle,
    bookAppointment,
    calculateLoyaltyDiscount,
    createEsewaPayment,
    getAvailableParts,
    getCustomerActivity,
    getCustomerProfile,
    requestPart,
    saveCustomerProfile,
    submitReview,
    type AvailablePart,
    type CustomerActivity,
    type EsewaPaymentInitiation,
    type CustomerProfile,
    type PartRequest,
    type ServiceReview,
    type Vehicle,
} from "../../api/customer";
import DashboardShell from "../../components/Admin/DashboardShell";
import { useAuth } from "../../context/useAuth";
import brakePadImage from "../../assets/parts/brake-pad.png";
import engineOilImage from "../../assets/parts/engine-oil.jpg";
import sparkPlugImage from "../../assets/parts/spark-plug.jpg";
import airFilterImage from "../../assets/parts/air-filter.svg";
import clutchPlateImage from "../../assets/parts/clutch-plate.svg";
import alloyWheelImage from "../../assets/parts/alloy-wheel.svg";
import carBatteryImage from "../../assets/parts/car-battery.svg";
import radiatorImage from "../../assets/parts/radiator.svg";
import headlightImage from "../../assets/parts/headlight.svg";
import tireImage from "../../assets/parts/tire.svg";
import fuelFilterImage from "../../assets/parts/fuel-filter.svg";
import wiperBladeImage from "../../assets/parts/wiper-blade.svg";
import shockAbsorberImage from "../../assets/parts/shock-absorber.svg";
import alternatorImage from "../../assets/parts/alternator.svg";
import timingBeltImage from "../../assets/parts/timing-belt.svg";
import defaultPartImage from "../../assets/parts/default.png";

const customerNav = [
    { to: "/customer/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/customer/profile", label: "Profile", icon: UserRound },
    { to: "/customer/appointments", label: "Appointments", icon: CalendarDays },
    { to: "/customer/catalog", label: "Available Parts", icon: Boxes },
    { to: "/customer/parts", label: "Part Requests", icon: PackageSearch },
    { to: "/customer/payments", label: "Payments", icon: CreditCard },
    { to: "/customer/support", label: "Support", icon: Headphones },
    { to: "/customer/notifications", label: "Notifications", icon: Bell },
    { to: "/customer/history", label: "History", icon: History },
];

const emptyActivity: CustomerActivity = {
    appointments: [],
    partRequests: [],
    reviews: [],
    history: [],
};

const blankVehicle = (): Vehicle => ({
    id: `vehicle-${Date.now()}`,
    vehicleNumber: "",
    vehicleBrand: "",
    vehicleModel: "",
    vehicleYear: "",
});

const sectionCopy = {
    dashboard: {
        eyebrow: "Axleworks",
        title: "Overview",
        subtitle: "Manage bookings, parts, payments, and vehicle services.",
    },
    profile: {
        eyebrow: "Customer",
        title: "Profile & Vehicles",
        subtitle: "Manage your profile and vehicle details.",
    },
    appointments: {
        eyebrow: "Service Desk",
        title: "Appointments",
        subtitle: "Book services and submit service reviews.",
    },
    catalog: {
        eyebrow: "Parts Store",
        title: "Available Parts",
        subtitle: "Browse available vehicle parts and stock details.",
    },
    parts: {
        eyebrow: "Parts Concierge",
        title: "Unavailable Parts",
        subtitle: "Request unavailable parts and track their status.",
    },
    payments: {
        eyebrow: "Billing",
        title: "Payments & Credit",
        subtitle: "View credit balance, loyalty discount, and payment options.",
    },
    support: {
        eyebrow: "Care Desk",
        title: "Support Center",
        subtitle: "Create support tickets and contact the service team.",
    },
    notifications: {
        eyebrow: "Alerts",
        title: "Notifications",
        subtitle: "View service, part request, and payment reminders.",
    },
    history: {
        eyebrow: "Account",
        title: "History & Loyalty",
        subtitle: "Review your purchase and service history.",
    },
};

const fallbackAvailableParts: AvailablePart[] = [
    {
        partId: 101,
        partName: "Brake Pad Set",
        price: 3200,
        stockQuantity: 18,
        vendorName: "Axleworks Stock",
        imageUrl: brakePadImage,
        vehicleBrand: "Toyota / Honda",
        vehicleModel: "Sedan and compact SUV",
    },
    {
        partId: 102,
        partName: "Synthetic Engine Oil 5W-30",
        price: 1850,
        stockQuantity: 26,
        vendorName: "Axleworks Stock",
        imageUrl: engineOilImage,
        vehicleBrand: "Multi-brand",
        vehicleModel: "Petrol engines",
    },
    {
        partId: 103,
        partName: "Iridium Spark Plug",
        price: 950,
        stockQuantity: 34,
        vendorName: "Axleworks Stock",
        imageUrl: sparkPlugImage,
        vehicleBrand: "Nissan / Hyundai",
        vehicleModel: "1.2L to 1.8L engines",
    },
    {
        partId: 104,
        partName: "Air Filter",
        price: 780,
        stockQuantity: 12,
        vendorName: "Axleworks Stock",
        imageUrl: airFilterImage,
        vehicleBrand: "Universal",
        vehicleModel: "Most passenger vehicles",
    },
    {
        partId: 105,
        partName: "Clutch Plate",
        price: 4200,
        stockQuantity: 9,
        vendorName: "Axleworks Stock",
        imageUrl: clutchPlateImage,
        vehicleBrand: "Toyota / Suzuki",
        vehicleModel: "Manual transmission",
    },
    {
        partId: 106,
        partName: "Alloy Wheel",
        price: 8500,
        stockQuantity: 16,
        vendorName: "Axleworks Stock",
        imageUrl: alloyWheelImage,
        vehicleBrand: "Universal",
        vehicleModel: "15 to 17 inch fitment",
    },
    {
        partId: 107,
        partName: "Car Battery",
        price: 7600,
        stockQuantity: 14,
        vendorName: "Axleworks Stock",
        imageUrl: carBatteryImage,
        vehicleBrand: "Multi-brand",
        vehicleModel: "12V passenger vehicles",
    },
    {
        partId: 108,
        partName: "Radiator",
        price: 9800,
        stockQuantity: 8,
        vendorName: "Axleworks Stock",
        imageUrl: radiatorImage,
        vehicleBrand: "Toyota / Nissan",
        vehicleModel: "Sedan and SUV cooling system",
    },
    {
        partId: 109,
        partName: "Headlight",
        price: 5200,
        stockQuantity: 20,
        vendorName: "Axleworks Stock",
        imageUrl: headlightImage,
        vehicleBrand: "Hyundai / Suzuki",
        vehicleModel: "Front lighting assembly",
    },
    {
        partId: 110,
        partName: "Tire",
        price: 6900,
        stockQuantity: 24,
        vendorName: "Axleworks Stock",
        imageUrl: tireImage,
        vehicleBrand: "Universal",
        vehicleModel: "Passenger vehicle tire",
    },
    {
        partId: 111,
        partName: "Fuel Filter",
        price: 1450,
        stockQuantity: 17,
        vendorName: "Axleworks Stock",
        imageUrl: fuelFilterImage,
        vehicleBrand: "Multi-brand",
        vehicleModel: "Petrol and diesel engines",
    },
    {
        partId: 112,
        partName: "Wiper Blade",
        price: 1200,
        stockQuantity: 30,
        vendorName: "Axleworks Stock",
        imageUrl: wiperBladeImage,
        vehicleBrand: "Universal",
        vehicleModel: "Front windshield",
    },
    {
        partId: 113,
        partName: "Shock Absorber",
        price: 6400,
        stockQuantity: 10,
        vendorName: "Axleworks Stock",
        imageUrl: shockAbsorberImage,
        vehicleBrand: "Toyota / Hyundai",
        vehicleModel: "Suspension system",
    },
    {
        partId: 114,
        partName: "Alternator",
        price: 11800,
        stockQuantity: 7,
        vendorName: "Axleworks Stock",
        imageUrl: alternatorImage,
        vehicleBrand: "Multi-brand",
        vehicleModel: "Charging system",
    },
    {
        partId: 115,
        partName: "Timing Belt",
        price: 3600,
        stockQuantity: 15,
        vendorName: "Axleworks Stock",
        imageUrl: timingBeltImage,
        vehicleBrand: "Honda / Nissan",
        vehicleModel: "Engine timing system",
    },
];

const getCatalogPartKey = (partName: string) => {
    const name = partName.toLowerCase();

    if (name.includes("brake")) return "brake";
    if (name.includes("oil")) return "oil";
    if (name.includes("spark")) return "spark";
    if (name.includes("air") && name.includes("filter")) return "air-filter";
    if (name.includes("clutch") || name.includes("clucth") || name.includes("plage")) return "clutch";
    if (name.includes("alloy") || name.includes("aloy") || name.includes("wheel")) return "alloy-wheel";
    if (name.includes("battery")) return "battery";
    if (name.includes("radiator")) return "radiator";
    if (name.includes("headlight") || name.includes("head light")) return "headlight";
    if (name.includes("tire") || name.includes("tyre")) return "tire";
    if (name.includes("fuel") && name.includes("filter")) return "fuel-filter";
    if (name.includes("wiper")) return "wiper";
    if (name.includes("shock") || name.includes("absorber")) return "shock-absorber";
    if (name.includes("alternator")) return "alternator";
    if (name.includes("timing") && name.includes("belt")) return "timing-belt";

    return name.trim();
};

const includeFallbackAvailableParts = (apiParts: AvailablePart[]) => {
    const existingKeys = new Set(
        apiParts.map((part) => getCatalogPartKey(part.partName))
    );
    const missingParts = fallbackAvailableParts.filter(
        (part) => !existingKeys.has(getCatalogPartKey(part.partName))
    );

    return [...apiParts, ...missingParts];
};

export default function CustomerDashboard() {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<CustomerProfile | null>(null);
    const [activity, setActivity] = useState<CustomerActivity>(emptyActivity);
    const [availableParts, setAvailableParts] = useState<AvailablePart[]>(fallbackAvailableParts);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [appointmentForm, setAppointmentForm] = useState({
        serviceType: "Full service",
        vehicleNumber: "",
        preferredDate: new Date().toISOString().slice(0, 10),
        notes: "",
    });
    const [partForm, setPartForm] = useState({
        partName: "",
        vehicleModel: "",
        urgency: "Normal" as PartRequest["urgency"],
    });
    const [reviewForm, setReviewForm] = useState({
        serviceName: "",
        rating: 5,
        comment: "",
    });
    const [supportForm, setSupportForm] = useState({
        topic: "Service question",
        priority: "Normal",
        message: "",
    });
    const [supportTickets, setSupportTickets] = useState([
        {
            id: "ticket-demo-1",
            title: "Front desk follow-up",
            meta: "Open - Response expected today",
            icon: Headphones,
        },
    ]);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [esewaPayment, setEsewaPayment] = useState<EsewaPaymentInitiation | null>(null);

    const section = (location.pathname.split("/").at(-1) ?? "dashboard") as keyof typeof sectionCopy;
    const copy = sectionCopy[section] ?? sectionCopy.dashboard;

    useEffect(() => {
        const loadCustomer = async () => {
            try {
                const [profileData, activityData, partsData] = await Promise.all([
                    getCustomerProfile(user?.email, user?.customerId),
                    getCustomerActivity(user?.customerId, user?.fullName),
                    getAvailableParts(),
                ]);
                setProfile(profileData);
                setActivity(activityData);
                setAvailableParts(includeFallbackAvailableParts(partsData));
                setAppointmentForm((current) => ({
                    ...current,
                    vehicleNumber: profileData.vehicles[0]?.vehicleNumber ?? "",
                }));
            } finally {
                setLoading(false);
            }
        };

        loadCustomer();
    }, [user?.customerId, user?.email, user?.fullName]);

    const nextAppointment = activity.appointments[0];
    const openRequests = activity.partRequests.filter((item) => item.status !== "Arrived").length;
    const averageRating = activity.reviews.length === 0
        ? 0
        : activity.reviews.reduce((sum, item) => sum + item.rating, 0) / activity.reviews.length;
    const creditIsOverdue = useMemo(() => {
        if (!profile?.creditDueDate || profile.creditBalance <= 0) return false;
        const dueDate = new Date(profile.creditDueDate);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return dueDate < monthAgo;
    }, [profile]);
    const loyalty = calculateLoyaltyDiscount(profile?.totalSpend ?? 0);

    const updateProfileField = (field: keyof CustomerProfile, value: string) => {
        if (!profile) return;
        setProfile({ ...profile, [field]: value });
    };

    const updateVehicle = (id: string, field: keyof Vehicle, value: string) => {
        if (!profile) return;
        setProfile({
            ...profile,
            vehicles: profile.vehicles.map((vehicle) =>
                vehicle.id === id ? { ...vehicle, [field]: value } : vehicle
            ),
        });
    };

    const handleSaveProfile = async () => {
        if (!profile) return;
        const saved = await saveCustomerProfile(profile);
        const newVehicles = profile.vehicles.filter((vehicle) => Number.isNaN(Number(vehicle.id)));
        const createdVehicles = saved.customerId
            ? await Promise.all(newVehicles.map((vehicle) => addCustomerVehicle(saved.customerId!, vehicle)))
            : [];

        setProfile({
            ...saved,
            vehicles: [...saved.vehicles, ...createdVehicles],
        });
        setMessage("Profile updated successfully.");
    };

    const handleBookAppointment = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!profile) return;
        const created = await bookAppointment({
            customerName: profile.fullName,
            vehicleNumber: appointmentForm.vehicleNumber,
            serviceType: appointmentForm.serviceType,
            preferredDate: appointmentForm.preferredDate,
            notes: appointmentForm.notes,
        }, profile.customerId);
        setActivity((current) => ({
            ...current,
            appointments: [created, ...current.appointments],
        }));
        setAppointmentForm((current) => ({ ...current, notes: "" }));
        setMessage("Appointment request submitted.");
    };

    const handlePartRequest = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!profile) return;
        const created = await requestPart({
            customerName: profile.fullName,
            partName: partForm.partName,
            vehicleModel: partForm.vehicleModel,
            urgency: partForm.urgency,
        }, profile.customerId);
        setActivity((current) => ({
            ...current,
            partRequests: [created, ...current.partRequests],
        }));
        setPartForm({ partName: "", vehicleModel: "", urgency: "Normal" });
        setMessage("Part request sent.");
    };

    const handleRequestAvailablePart = (part: AvailablePart) => {
        setPartForm({
            partName: part.partName,
            vehicleModel: part.vehicleModel || part.vehicleBrand || "",
            urgency: "Normal",
        });
        setMessage("Part selected. Send the request to reserve it.");
        navigate("/customer/parts");
    };

    const handleReview = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!profile) return;
        const created = await submitReview({
            serviceName: reviewForm.serviceName,
            rating: reviewForm.rating,
            comment: reviewForm.comment,
        }, profile.customerId);
        setActivity((current) => ({
            ...current,
            reviews: [created, ...current.reviews],
        }));
        setReviewForm({ serviceName: "", rating: 5, comment: "" });
        setMessage("Review submitted.");
    };

    const handleSupportTicket = (event: React.FormEvent) => {
        event.preventDefault();
        setSupportTickets((current) => [
            {
                id: `ticket-${Date.now()}`,
                title: supportForm.topic,
                meta: `${supportForm.priority} - ${supportForm.message || "No extra details"}`,
                icon: Headphones,
            },
            ...current,
        ]);
        setSupportForm({ topic: "Service question", priority: "Normal", message: "" });
        setMessage("Support ticket created.");
    };

    const handleEsewaPayment = async () => {
        if (!profile) return;

        try {
            setPaymentLoading(true);
            setMessage("Opening eSewa payment...");

            const amount = profile.creditBalance > 0
                ? profile.creditBalance
                : Math.max(profile.totalSpend ?? 1, 1);
            const payment = await createEsewaPayment(amount);
            setEsewaPayment(payment);
            setMessage("Payment ready. Continue to eSewa.");
        } catch {
            setMessage("Unable to open eSewa. Please try again.");
            setPaymentLoading(false);
        }
    };

    useEffect(() => {
        if (!esewaPayment) return;

        const timeout = window.setTimeout(() => {
            const form = document.getElementById("esewa-payment-form") as HTMLFormElement | null;
            if (form) HTMLFormElement.prototype.submit.call(form);
        }, 700);

        return () => window.clearTimeout(timeout);
    }, [esewaPayment]);

    if (loading || !profile) {
        return (
            <div className="min-h-screen grid place-items-center bg-[oklch(0.965_0.012_85)]">
                Loading customer workspace...
            </div>
        );
    }

    return (
        <DashboardShell role="Customer" nav={customerNav}>
            <div className="space-y-8">
                <PageHeader copy={copy} message={message} />

                {section === "dashboard" && (
                    <Overview
                        profile={profile}
                        activity={activity}
                        nextAppointment={nextAppointment}
                        openRequests={openRequests}
                        averageRating={averageRating}
                        creditIsOverdue={creditIsOverdue}
                    />
                )}

                {section === "profile" && (
                    <ProfilePage
                        profile={profile}
                        updateProfileField={updateProfileField}
                        updateVehicle={updateVehicle}
                        addVehicle={() => setProfile({
                            ...profile,
                            vehicles: [...profile.vehicles, blankVehicle()],
                        })}
                        removeVehicle={(id) => setProfile({
                            ...profile,
                            vehicles: profile.vehicles.filter((vehicle) => vehicle.id !== id),
                        })}
                        saveProfile={handleSaveProfile}
                    />
                )}

                {section === "appointments" && (
                    <AppointmentsPage
                        appointmentForm={appointmentForm}
                        setAppointmentForm={setAppointmentForm}
                        reviewForm={reviewForm}
                        setReviewForm={setReviewForm}
                        appointments={activity.appointments}
                        reviews={activity.reviews}
                        handleBookAppointment={handleBookAppointment}
                        handleReview={handleReview}
                    />
                )}

                {section === "parts" && (
                    <PartsPage
                        partForm={partForm}
                        setPartForm={setPartForm}
                        requests={activity.partRequests}
                        handlePartRequest={handlePartRequest}
                    />
                )}

                {section === "catalog" && (
                    <AvailablePartsPage
                        parts={availableParts}
                        onRequestPart={handleRequestAvailablePart}
                    />
                )}

                {section === "history" && (
                    <HistoryPage
                        profile={profile}
                        activity={activity}
                    />
                )}

                {section === "payments" && (
                    <PaymentsPage
                        profile={profile}
                        loyalty={loyalty}
                        creditIsOverdue={creditIsOverdue}
                        onPayWithEsewa={handleEsewaPayment}
                        paymentLoading={paymentLoading}
                        esewaPayment={esewaPayment}
                    />
                )}

                {section === "support" && (
                    <SupportPage
                        supportForm={supportForm}
                        setSupportForm={setSupportForm}
                        tickets={supportTickets}
                        handleSupportTicket={handleSupportTicket}
                    />
                )}

                {section === "notifications" && (
                    <NotificationsPage
                        profile={profile}
                        activity={activity}
                        openRequests={openRequests}
                        creditIsOverdue={creditIsOverdue}
                    />
                )}
            </div>
        </DashboardShell>
    );
}

function PageHeader({
    copy,
    message,
}: {
    copy: { eyebrow: string; title: string; subtitle: string };
    message: string;
}) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
                <div className="text-[11px] uppercase tracking-[0.35em] text-[oklch(0.48_0.04_65)]">
                    {copy.eyebrow}
                </div>
                <h1 className="mt-3 text-5xl font-bold tracking-tight text-[oklch(0.16_0.01_60)]">
                    {copy.title}
                </h1>
                <p className="mt-3 max-w-2xl text-[oklch(0.46_0.015_70)]">
                    {copy.subtitle}
                </p>
            </div>

            {message && (
                <div className="rounded-2xl border border-[oklch(0.82_0.09_135)] bg-[oklch(0.94_0.045_135)] px-5 py-3 text-sm font-medium">
                    {message}
                </div>
            )}
        </div>
    );
}

function Overview({
    profile,
    activity,
    nextAppointment,
    openRequests,
    averageRating,
    creditIsOverdue,
}: {
    profile: CustomerProfile;
    activity: CustomerActivity;
    nextAppointment: CustomerActivity["appointments"][number] | undefined;
    openRequests: number;
    averageRating: number;
    creditIsOverdue: boolean;
}) {
    return (
        <>
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
                <Metric label="Vehicles" value={`${profile.vehicles.length}`} hint="Registered for service" />
                <Metric label="Bookings" value={`${activity.appointments.length}`} hint="Total service requests" />
                <Metric label="Total spend" value={`Rs. ${profile.totalSpend}`} hint="Purchase and service value" />
                <Metric
                    label="Credit due"
                    value={`Rs. ${profile.creditBalance}`}
                    hint={creditIsOverdue ? "Reminder eligible" : "Clear or within cycle"}
                />
            </div>

            <div className="grid xl:grid-cols-3 gap-6">
                <Panel className="xl:col-span-2" title="Service Snapshot">
                    <div className="grid md:grid-cols-3 gap-4">
                        <StatusTile
                            icon={CalendarDays}
                            label="Next Visit"
                            value={nextAppointment?.preferredDate ?? "Not booked"}
                            tone="dark"
                        />
                        <StatusTile
                            icon={PackageSearch}
                            label="Open Requests"
                            value={`${openRequests}`}
                            tone="amber"
                        />
                        <StatusTile
                            icon={Star}
                            label="Review Score"
                            value={averageRating ? averageRating.toFixed(1) : "New"}
                            tone="light"
                        />
                    </div>

                </Panel>

                <Panel title="Recent Activity">
                    <CompactList
                        empty="No activity yet."
                        items={[
                            ...activity.appointments.slice(0, 2).map((item) => ({
                                id: `apt-${item.id}`,
                                title: item.serviceType,
                                meta: `${item.preferredDate} - ${item.status}`,
                                icon: CalendarDays,
                            })),
                            ...activity.partRequests.slice(0, 2).map((item) => ({
                                id: `part-${item.id}`,
                                title: item.partName,
                                meta: `${item.vehicleModel} - ${item.status}`,
                                icon: PackageSearch,
                            })),
                        ]}
                    />
                </Panel>
            </div>
        </>
    );
}

function ProfilePage({
    profile,
    updateProfileField,
    updateVehicle,
    addVehicle,
    removeVehicle,
    saveProfile,
}: {
    profile: CustomerProfile;
    updateProfileField: (field: keyof CustomerProfile, value: string) => void;
    updateVehicle: (id: string, field: keyof Vehicle, value: string) => void;
    addVehicle: () => void;
    removeVehicle: (id: string) => void;
    saveProfile: () => void;
}) {
    return (
        <div className="space-y-6">
            <Panel title="Personal Details">
                <div className="grid md:grid-cols-2 gap-5">
                    <Field label="Full Name" value={profile.fullName} onChange={(value) => updateProfileField("fullName", value)} />
                    <Field label="Email" value={profile.email} onChange={(value) => updateProfileField("email", value)} />
                    <Field label="Phone" value={profile.phone} onChange={(value) => updateProfileField("phone", value)} />
                    <div className="flex items-end">
                        <PrimaryButton icon={Save} label="Save Profile" onClick={saveProfile} type="button" />
                    </div>
                </div>
            </Panel>

            <Panel title="Vehicle Garage">
                <div className="grid xl:grid-cols-2 gap-5">
                    {profile.vehicles.map((vehicle) => (
                        <div key={vehicle.id} className="overflow-hidden rounded-3xl border border-[oklch(0.88_0.012_80)] bg-[oklch(0.965_0.012_85)]">
                            <div className="flex items-center justify-between bg-[oklch(0.18_0.012_60)] p-5 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
                                        <Car className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold">{vehicle.vehicleNumber || "New vehicle"}</div>
                                        <div className="text-sm text-white/60">
                                            {vehicle.vehicleBrand || "Brand"} {vehicle.vehicleModel || "Model"}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeVehicle(vehicle.id)}
                                    className="grid h-10 w-10 place-items-center rounded-xl text-red-300 hover:bg-white/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="grid md:grid-cols-4 gap-4 p-5">
                                <Field label="Number" value={vehicle.vehicleNumber} onChange={(value) => updateVehicle(vehicle.id, "vehicleNumber", value)} />
                                <Field label="Brand" value={vehicle.vehicleBrand} onChange={(value) => updateVehicle(vehicle.id, "vehicleBrand", value)} />
                                <Field label="Model" value={vehicle.vehicleModel} onChange={(value) => updateVehicle(vehicle.id, "vehicleModel", value)} />
                                <Field label="Year" value={vehicle.vehicleYear} onChange={(value) => updateVehicle(vehicle.id, "vehicleYear", value)} />
                            </div>
                            <div className="grid grid-cols-3 border-t border-[oklch(0.88_0.012_80)] text-sm">
                                <VehicleMeta label="Status" value="Ready" />
                                <VehicleMeta label="Service" value="Available" />
                                <VehicleMeta label="Record" value={Number.isNaN(Number(vehicle.id)) ? "New" : "Saved"} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-5">
                    <PrimaryButton icon={Car} label="Add Vehicle" onClick={addVehicle} type="button" variant="outline" />
                </div>
            </Panel>
        </div>
    );
}

function AppointmentsPage({
    appointmentForm,
    setAppointmentForm,
    reviewForm,
    setReviewForm,
    appointments,
    reviews,
    handleBookAppointment,
    handleReview,
}: {
    appointmentForm: { serviceType: string; vehicleNumber: string; preferredDate: string; notes: string };
    setAppointmentForm: (value: { serviceType: string; vehicleNumber: string; preferredDate: string; notes: string }) => void;
    reviewForm: { serviceName: string; rating: number; comment: string };
    setReviewForm: (value: { serviceName: string; rating: number; comment: string }) => void;
    appointments: CustomerActivity["appointments"];
    reviews: ServiceReview[];
    handleBookAppointment: (event: React.FormEvent) => void;
    handleReview: (event: React.FormEvent) => void;
}) {
    return (
        <div className="grid xl:grid-cols-3 gap-6">
            <Panel className="xl:col-span-2" title="Book Appointment">
                <form onSubmit={handleBookAppointment} className="grid md:grid-cols-2 gap-5">
                    <SelectField
                        label="Service"
                        value={appointmentForm.serviceType}
                        options={["Full service", "Engine diagnostics", "Oil change", "Brake inspection", "Wheel alignment"]}
                        onChange={(value) => setAppointmentForm({ ...appointmentForm, serviceType: value })}
                    />
                    <Field label="Vehicle Number" value={appointmentForm.vehicleNumber} onChange={(value) => setAppointmentForm({ ...appointmentForm, vehicleNumber: value })} />
                    <Field label="Preferred Date" type="date" value={appointmentForm.preferredDate} onChange={(value) => setAppointmentForm({ ...appointmentForm, preferredDate: value })} />
                    <TextArea label="Service Notes" value={appointmentForm.notes} onChange={(value) => setAppointmentForm({ ...appointmentForm, notes: value })} />
                    <div className="md:col-span-2">
                        <PrimaryButton icon={CalendarDays} label="Request Booking" />
                    </div>
                </form>
            </Panel>

            <Panel title="Booking Queue">
                <CompactList
                    empty="No appointments booked."
                    items={appointments.map((item) => ({
                        id: item.id,
                        title: item.serviceType,
                        meta: `${item.preferredDate} - ${item.status}`,
                        icon: Clock,
                    }))}
                />
            </Panel>

            <Panel className="xl:col-span-2" title="Review Service">
                <form onSubmit={handleReview} className="grid md:grid-cols-2 gap-5">
                    <Field label="Service Name" value={reviewForm.serviceName} onChange={(value) => setReviewForm({ ...reviewForm, serviceName: value })} />
                    <Field label="Rating" type="number" value={`${reviewForm.rating}`} onChange={(value) => setReviewForm({ ...reviewForm, rating: Math.min(5, Math.max(1, Number(value))) })} />
                    <TextArea label="Comment" value={reviewForm.comment} onChange={(value) => setReviewForm({ ...reviewForm, comment: value })} />
                    <div className="flex items-end">
                        <PrimaryButton icon={Star} label="Submit Review" />
                    </div>
                </form>
            </Panel>

            <Panel title="Feedback">
                <CompactList
                    empty="No reviews yet."
                    items={reviews.map((item) => ({
                        id: item.id,
                        title: item.serviceName,
                        meta: `${item.rating}/5 - ${item.comment}`,
                        icon: Star,
                    }))}
                />
            </Panel>
        </div>
    );
}

function AvailablePartsPage({
    parts,
    onRequestPart,
}: {
    parts: AvailablePart[];
    onRequestPart: (part: AvailablePart) => void;
}) {
    const [query, setQuery] = useState("");
    const totalStock = parts.reduce((sum, part) => sum + part.stockQuantity, 0);
    const filteredParts = parts.filter((part) => {
        const text = [
            part.partName,
            part.vehicleBrand,
            part.vehicleModel,
            part.vendorName,
        ].join(" ").toLowerCase();

        return text.includes(query.trim().toLowerCase());
    });

    return (
        <div className="space-y-6">
            <Panel title="Parts Available Now">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="rounded-3xl border border-[oklch(0.88_0.018_82)] bg-white p-5">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <div className="text-[10px] uppercase tracking-[0.28em] text-[oklch(0.48_0.04_65)]">
                                    Stock Room
                                </div>
                                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                                    {parts.length} parts ready
                                </h2>
                                <p className="mt-2 text-sm text-[oklch(0.48_0.015_70)]">
                                    Customers can check photos, vehicle fitment, and current quantity before making a request.
                                </p>
                            </div>

                            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[oklch(0.94_0.12_82)]">
                                <Boxes className="h-7 w-7 text-[oklch(0.34_0.075_65)]" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <MiniStat label="Total stock" value={`${totalStock}`} />
                        <MiniStat label="Ready items" value={`${parts.length}`} />
                        <MiniStat label="Fast request" value="Yes" />
                        <MiniStat label="Photos" value="Included" />
                    </div>
                </div>

                <label className="mt-6 flex items-center gap-3 rounded-2xl border border-[oklch(0.88_0.012_80)] bg-white px-4 py-3">
                    <Search className="h-4 w-4 text-[oklch(0.48_0.012_70)]" />
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search by part name, vehicle, or vendor"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-[oklch(0.58_0.012_70)]"
                    />
                </label>
            </Panel>

            {filteredParts.length === 0 ? (
                <EmptyState title="No matching parts" text="Try another part name or vehicle model." />
            ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredParts.map((part) => (
                        <PartCatalogCard
                            key={part.partId}
                            part={part}
                            onRequestPart={onRequestPart}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function PartCatalogCard({
    part,
    onRequestPart,
}: {
    part: AvailablePart;
    onRequestPart: (part: AvailablePart) => void;
}) {
    const fitment = [part.vehicleBrand, part.vehicleModel].filter(Boolean).join(" - ") || "Universal fitment";
    const stockTone = part.stockQuantity <= 5
        ? "bg-[oklch(0.97_0.045_55)] text-[oklch(0.46_0.12_42)]"
        : "bg-[oklch(0.95_0.045_145)] text-[oklch(0.36_0.10_145)]";

    return (
        <article className="overflow-hidden rounded-3xl border border-[oklch(0.88_0.012_80)] bg-[oklch(0.985_0.008_85)] shadow-sm">
            <div className="relative aspect-[4/3] bg-[oklch(0.94_0.01_80)]">
                <img
                    src={resolvePartImage(part)}
                    alt={part.partName}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                        event.currentTarget.src = defaultPartImage;
                    }}
                />
                <div className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${stockTone}`}>
                    {part.stockQuantity} in stock
                </div>
            </div>

            <div className="space-y-4 p-5">
                <div>
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-bold tracking-tight text-[oklch(0.16_0.01_60)]">
                            {part.partName}
                        </h3>
                        <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-[oklch(0.58_0.16_75)]" />
                    </div>
                    <p className="mt-2 text-sm text-[oklch(0.48_0.015_70)]">
                        {fitment}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-white p-3">
                        <div className="text-[9px] uppercase tracking-[0.2em] text-[oklch(0.5_0.012_70)]">
                            Price
                        </div>
                        <div className="mt-1 font-bold">Rs. {part.price}</div>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                        <div className="text-[9px] uppercase tracking-[0.2em] text-[oklch(0.5_0.012_70)]">
                            Source
                        </div>
                        <div className="mt-1 font-bold">{part.vendorName ?? "In house"}</div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => onRequestPart(part)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[oklch(0.72_0.15_72)] px-5 py-3 text-sm font-bold text-[oklch(0.16_0.01_60)] transition hover:bg-[oklch(0.68_0.16_68)]"
                >
                    <ShieldCheck className="h-4 w-4" />
                    Request this part
                </button>
            </div>
        </article>
    );
}

function resolvePartImage(part: AvailablePart) {
    if (part.imageUrl?.startsWith("http") || part.imageUrl?.startsWith("data:")) {
        return part.imageUrl;
    }

    if (part.imageUrl?.startsWith("/src/") || part.imageUrl?.startsWith("/assets/")) {
        return part.imageUrl;
    }

    if (part.imageUrl?.startsWith("/")) {
        return `${import.meta.env.VITE_SERVER_URL ?? ""}${part.imageUrl}`;
    }

    if (part.imageUrl) {
        return part.imageUrl;
    }

    const name = part.partName.toLowerCase();
    if (name.includes("brake")) return brakePadImage;
    if (name.includes("oil")) return engineOilImage;
    if (name.includes("spark")) return sparkPlugImage;
    if (name.includes("air") && name.includes("filter")) return airFilterImage;
    if (name.includes("clutch") || name.includes("clucth") || name.includes("plage")) return clutchPlateImage;
    if (name.includes("alloy") || name.includes("aloy") || name.includes("wheel")) return alloyWheelImage;
    if (name.includes("battery")) return carBatteryImage;
    if (name.includes("radiator")) return radiatorImage;
    if (name.includes("headlight") || name.includes("head light")) return headlightImage;
    if (name.includes("tire") || name.includes("tyre")) return tireImage;
    if (name.includes("fuel") && name.includes("filter")) return fuelFilterImage;
    if (name.includes("wiper")) return wiperBladeImage;
    if (name.includes("shock") || name.includes("absorber")) return shockAbsorberImage;
    if (name.includes("alternator")) return alternatorImage;
    if (name.includes("timing") && name.includes("belt")) return timingBeltImage;
    return defaultPartImage;
}

function PartsPage({
    partForm,
    setPartForm,
    requests,
    handlePartRequest,
}: {
    partForm: { partName: string; vehicleModel: string; urgency: PartRequest["urgency"] };
    setPartForm: (value: { partName: string; vehicleModel: string; urgency: PartRequest["urgency"] }) => void;
    requests: PartRequest[];
    handlePartRequest: (event: React.FormEvent) => void;
}) {
    return (
        <div className="grid xl:grid-cols-3 gap-6">
            <Panel className="xl:col-span-2" title="Request a Part">
                <form onSubmit={handlePartRequest} className="grid md:grid-cols-2 gap-5">
                    <Field
                        label="Part Name"
                        value={partForm.partName}
                        onChange={(value) => setPartForm({ ...partForm, partName: value })}
                    />
                    <Field
                        label="Vehicle Model"
                        value={partForm.vehicleModel}
                        onChange={(value) => setPartForm({ ...partForm, vehicleModel: value })}
                    />
                    <SelectField
                        label="Priority"
                        value={partForm.urgency}
                        options={["Normal", "Urgent"]}
                        onChange={(value) => setPartForm({ ...partForm, urgency: value as PartRequest["urgency"] })}
                    />
                    <div className="flex items-end">
                        <PrimaryButton icon={Send} label="Send Request" />
                    </div>
                </form>
            </Panel>

            <Panel title="Request Status">
                {requests.length === 0 ? (
                    <div className="rounded-3xl bg-[oklch(0.94_0.01_80)] p-7 text-center">
                        <PackageSearch className="mx-auto h-7 w-7 text-[oklch(0.45_0.012_70)]" />
                        <div className="mt-4 text-lg font-bold">No part requests yet</div>
                        <p className="mt-2 text-sm leading-6 text-[oklch(0.5_0.012_70)]">
                            Submitted requests and sourcing updates will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {requests.map((item) => (
                            <PartRequestCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </Panel>
        </div>
    );
}

function PartRequestCard({ item }: { item: PartRequest }) {
    const statusStyles = {
        Requested: "bg-[oklch(0.94_0.035_85)] text-[oklch(0.38_0.08_65)]",
        Sourcing: "bg-[oklch(0.94_0.045_235)] text-[oklch(0.34_0.11_235)]",
        Arrived: "bg-[oklch(0.94_0.045_145)] text-[oklch(0.34_0.10_145)]",
    };

    return (
        <div className="rounded-2xl border border-[oklch(0.88_0.012_80)] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="font-bold">{item.partName}</div>
                    <div className="mt-1 text-sm text-[oklch(0.5_0.012_70)]">
                        {item.vehicleModel || "Vehicle model not specified"}
                    </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status]}`}>
                    {item.status}
                </span>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-[oklch(0.94_0.01_80)] px-3 py-2 text-xs">
                <span className="text-[oklch(0.5_0.012_70)]">Priority</span>
                <span className={item.urgency === "Urgent" ? "font-bold text-red-600" : "font-bold"}>
                    {item.urgency}
                </span>
            </div>
        </div>
    );
}

function HistoryPage({
    activity,
    profile,
}: {
    activity: CustomerActivity;
    profile: CustomerProfile;
}) {
    return (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

            {/* HISTORY */}
            <Panel title="Purchase & Service History">

                {activity.history.length === 0 ? (
                    <div className="rounded-2xl border border-border p-10 text-center">
                        <History className="mx-auto h-8 w-8 opacity-50" />

                        <h3 className="mt-4 text-lg font-semibold">
                            No history available
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Purchases and services will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activity.history.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl border border-border bg-white p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold">
                                            {item.title}
                                        </div>

                                        <div className="mt-1 text-sm text-muted-foreground">
                                            {item.date}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="font-bold">
                                            Rs. {item.amount}
                                        </div>

                                        <div className="mt-1 text-sm">
                                            {item.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Panel>

            {/* LOYALTY SUMMARY */}
            <Panel title="Loyalty Summary">
                <div className="space-y-4">

                    <div className="rounded-2xl border border-border p-5">
                        <div className="text-sm text-muted-foreground">
                            Discount Eligibility
                        </div>

                        <div className="mt-2 text-2xl font-bold text-green-600">
                            10%
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border p-5">
                        <div className="text-sm text-muted-foreground">
                            Credit Balance
                        </div>

                        <div className="mt-2 text-2xl font-bold">
                            Rs. {profile.creditBalance ?? 0}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border p-5">
                        <div className="text-sm text-muted-foreground">
                            Current Status
                        </div>

                        <div className="mt-2 text-xl font-bold">
                            Good Standing
                        </div>
                    </div>
                </div>
            </Panel>
        </div>
    );
}
function PaymentsPage({
    profile,
    loyalty,
    creditIsOverdue,
    onPayWithEsewa,
    paymentLoading,
    esewaPayment,
}: {
    profile: CustomerProfile;
    loyalty: { discount: number; payable: number };
    creditIsOverdue: boolean;
    onPayWithEsewa: () => void;
    paymentLoading: boolean;
    esewaPayment: EsewaPaymentInitiation | null;
}) {
    const paymentMethods = [
        {
            title: "Cash Payment",
            description: "Pay directly at the service center.",
        },
        {
            title: "Card Payment",
            description: "Debit and credit cards are accepted.",
        },
        {
            title: "Bank Transfer",
            description: "Transfer using invoice reference number.",
        },
    ];

    return (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

            {/* PAYMENT SUMMARY */}
            <Panel title="Payment Summary">
                <div className="space-y-5">

                    <div className="flex items-center justify-between rounded-2xl border border-[oklch(0.88_0.012_80)] bg-white p-5">
                        <div>
                            <div className="text-sm text-[oklch(0.5_0.012_70)]">
                                Credit Balance
                            </div>

                            <div className="mt-2 text-3xl font-bold">
                                Rs. {profile.creditBalance}
                            </div>
                        </div>

                        <CreditCard className="h-7 w-7 text-[oklch(0.58_0.16_75)]" />
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-[oklch(0.88_0.012_80)] bg-white p-5">
                        <div>
                            <div className="text-sm text-[oklch(0.5_0.012_70)]">
                                Loyalty Discount
                            </div>

                            <div className="mt-2 text-3xl font-bold text-green-600">
                                Rs. {loyalty.discount.toFixed(0)}
                            </div>
                        </div>

                        <Gift className="h-7 w-7 text-green-600" />
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-[oklch(0.92_0.13_75)] p-5">
                        <div>
                            <div className="text-sm text-[oklch(0.35_0.05_65)]">
                                Final Payable
                            </div>

                            <div className="mt-2 text-4xl font-bold text-[oklch(0.18_0.012_60)]">
                                Rs. {loyalty.payable.toFixed(0)}
                            </div>
                        </div>

                        <FileText className="h-8 w-8 text-[oklch(0.25_0.05_65)]" />
                    </div>

                    <div
                        className={`rounded-2xl border p-5 ${creditIsOverdue
                                ? "border-red-200 bg-red-50"
                                : "border-green-200 bg-green-50"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-[oklch(0.5_0.012_70)]">
                                    Payment Status
                                </div>

                                <div className="mt-2 text-xl font-bold">
                                    {creditIsOverdue
                                        ? "Payment Overdue"
                                        : "Good Standing"}
                                </div>

                                <div className="mt-1 text-sm text-[oklch(0.45_0.012_70)]">
                                    Due Date: {profile.creditDueDate || "No due"}
                                </div>
                            </div>

                            <CheckCircle2 className="h-7 w-7" />
                        </div>
                    </div>
                </div>
            </Panel>

            {/* PAYMENT METHODS */}
            <Panel title="Payment Methods">
                <div className="space-y-4">

                    <button
                        type="button"
                        onClick={onPayWithEsewa}
                        disabled={paymentLoading}
                        className="flex w-full items-center justify-between rounded-2xl bg-[oklch(0.74_0.16_65)] px-5 py-4 text-left transition hover:opacity-90 disabled:opacity-70"
                    >
                        <div>
                            <div className="text-lg font-bold text-[oklch(0.18_0.012_60)]">
                                {paymentLoading
                                    ? "Opening eSewa..."
                                    : "Pay with eSewa"}
                            </div>

                            <div className="mt-1 text-sm text-[oklch(0.3_0.04_65)]">
                                Secure online payment
                            </div>
                        </div>

                        <CreditCard className="h-5 w-5 text-[oklch(0.18_0.012_60)]" />
                    </button>

                    {esewaPayment && (
                        <form
                            id="esewa-payment-form"
                            method={esewaPayment.method}
                            action={esewaPayment.formAction}
                            className="rounded-2xl border border-green-200 bg-green-50 p-4"
                        >
                            {Object.entries(esewaPayment.fields).map(([name, value]) => (
                                <input
                                    key={name}
                                    type="hidden"
                                    name={name}
                                    value={value}
                                />
                            ))}

                            <button
                                type="button"
                                onClick={() => {
                                    const form =
                                        document.getElementById(
                                            "esewa-payment-form"
                                        ) as HTMLFormElement | null;

                                    if (form) {
                                        HTMLFormElement.prototype.submit.call(form);
                                    }
                                }}
                                className="w-full rounded-xl bg-[oklch(0.205_0.012_60)] py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90"
                            >
                                Continue to eSewa
                            </button>
                        </form>
                    )}

                    <div className="space-y-3 pt-3">
                        {paymentMethods.map((method) => (
                            <div
                                key={method.title}
                                className="rounded-2xl border border-[oklch(0.88_0.012_80)] bg-white p-4"
                            >
                                <div className="font-semibold">
                                    {method.title}
                                </div>

                                <div className="mt-1 text-sm text-[oklch(0.5_0.012_70)]">
                                    {method.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Panel>
        </div>
    );
}


function SupportPage({
    supportForm,
    setSupportForm,
    tickets,
    handleSupportTicket,
}: {
    supportForm: { topic: string; priority: string; message: string };
    setSupportForm: (value: { topic: string; priority: string; message: string }) => void;
    tickets: Array<{ id: string; title: string; meta: string; icon: LucideIcon }>;
    handleSupportTicket: (event: React.FormEvent) => void;
}) {
    return (
        <div className="grid xl:grid-cols-3 gap-6">
            <Panel className="xl:col-span-2" title="Create Support Ticket">
                <form onSubmit={handleSupportTicket} className="grid md:grid-cols-2 gap-5">
                    <SelectField
                        label="Topic"
                        value={supportForm.topic}
                        options={["Service question", "Billing help", "Part request", "Complaint", "Emergency pickup"]}
                        onChange={(value) => setSupportForm({ ...supportForm, topic: value })}
                    />
                    <SelectField
                        label="Priority"
                        value={supportForm.priority}
                        options={["Normal", "High", "Urgent"]}
                        onChange={(value) => setSupportForm({ ...supportForm, priority: value })}
                    />
                    <TextArea
                        label="Message"
                        value={supportForm.message}
                        onChange={(value) => setSupportForm({ ...supportForm, message: value })}
                    />
                    <div className="md:col-span-2">
                        <PrimaryButton icon={Headphones} label="Send Ticket" />
                    </div>
                </form>
            </Panel>

            <Panel title="Help Channels">
                <div className="space-y-3">
                    <MiniStat label="Phone" value="9800000000" />
                    <MiniStat label="Desk Hours" value="9 AM - 6 PM" />
                    <MiniStat label="Emergency" value="Pickup support" />
                </div>
            </Panel>

            <Panel className="xl:col-span-3" title="Ticket Activity">
                <CompactList empty="No support tickets yet." items={tickets} />
            </Panel>
        </div>
    );
}

function NotificationsPage({
    profile,
    activity,
    openRequests,
    creditIsOverdue,
}: {
    profile: CustomerProfile;
    activity: CustomerActivity;
    openRequests: number;
    creditIsOverdue: boolean;
}) {
    const notifications = [
        {
            id: "credit",
            title: creditIsOverdue ? "Credit payment reminder" : "Credit account is clear",
            meta: creditIsOverdue
                ? `Rs. ${profile.creditBalance} is pending from ${profile.creditDueDate}.`
                : "No overdue credit balance at the moment.",
            icon: CreditCard,
        },
        {
            id: "parts",
            title: `${openRequests} open part request${openRequests === 1 ? "" : "s"}`,
            meta: openRequests > 0 ? "Track sourcing from Part Requests." : "No pending part sourcing updates.",
            icon: PackageSearch,
        },
        {
            id: "booking",
            title: activity.appointments[0]?.serviceType ?? "No upcoming booking",
            meta: activity.appointments[0]
                ? `${activity.appointments[0].preferredDate} - ${activity.appointments[0].status}`
                : "Book a service visit when your vehicle needs attention.",
            icon: Bell,
        },
    ];

    return (
        <div className="grid xl:grid-cols-3 gap-6">
            <Panel className="xl:col-span-2" title="Customer Alerts">
                <CompactList empty="No notifications yet." items={notifications} />
            </Panel>

            <Panel title="Reminder Settings">
                <div className="space-y-3">
                    <Checklist done label="Booking updates" />
                    <Checklist done label="Part request updates" />
                    <Checklist done={profile.creditBalance > 0} label="Credit reminders" />
                    <Checklist done={profile.vehicles.length > 0} label="Vehicle service reminders" />
                </div>
            </Panel>
        </div>
    );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
    return (
        <div className="rounded-3xl border border-[oklch(0.88_0.012_80)] bg-[oklch(0.985_0.008_85)] p-7">
            <div className="text-[11px] uppercase tracking-[0.35em] text-[oklch(0.48_0.04_65)]">
                {label}
            </div>
            <div className="mt-5 text-4xl font-bold tracking-tight text-[oklch(0.16_0.01_60)]">
                {value}
            </div>
            <div className="mt-3 text-sm text-[oklch(0.46_0.015_70)]">
                {hint}
            </div>
        </div>
    );
}

function Panel({
    title,
    children,
    className = "",
}: {
    title: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <section className={`rounded-3xl border border-[oklch(0.88_0.012_80)] bg-[oklch(0.985_0.008_85)] ${className}`}>
            <div className="border-b border-[oklch(0.88_0.012_80)] px-6 py-5">
                <h2 className="text-base font-semibold tracking-tight">{title}</h2>
            </div>
            <div className="p-6">{children}</div>
        </section>
    );
}

function StatusTile({
    icon: Icon,
    label,
    value,
    tone,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
    tone: "dark" | "amber" | "light";
}) {
    const styles = {
        dark: "bg-[oklch(0.18_0.012_60)] text-white",
        amber: "bg-[oklch(0.92_0.13_75)] text-[oklch(0.18_0.012_60)]",
        light: "bg-white text-[oklch(0.18_0.012_60)]",
    };

    return (
        <div className={`rounded-3xl p-5 ${styles[tone]}`}>
            <Icon className="h-5 w-5" />
            <div className="mt-5 text-[10px] uppercase tracking-[0.24em] opacity-70">{label}</div>
            <div className="mt-2 text-2xl font-bold">{value}</div>
        </div>
    );
}

function CompactList({
    items,
    empty,
}: {
    items: Array<{ id: string; title: string; meta: string; icon: LucideIcon }>;
    empty: string;
}) {
    if (items.length === 0) {
        return <EmptyState title={empty} text="New records will be shown here." />;
    }

    return (
        <div className="space-y-3">
            {items.map((item) => {
                const Icon = item.icon;
                return (
                    <div key={item.id} className="flex items-start gap-3 rounded-2xl bg-[oklch(0.94_0.01_80)] p-4">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white">
                            <Icon className="h-4 w-4 text-[oklch(0.35_0.012_60)]" />
                        </div>
                        <div>
                            <div className="font-semibold">{item.title}</div>
                            <div className="mt-1 text-sm text-[oklch(0.5_0.012_70)]">{item.meta}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function Checklist({ done, label }: { done: boolean; label: string }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-[oklch(0.94_0.01_80)] p-4">
            <CheckCircle2 className={`h-5 w-5 ${done ? "text-green-600" : "text-[oklch(0.55_0.012_70)]"}`} />
            <span className="text-sm font-medium">{label}</span>
        </div>
    );
}

function MiniStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between rounded-2xl bg-[oklch(0.94_0.01_80)] px-4 py-3">
            <span className="text-sm text-[oklch(0.5_0.012_70)]">{label}</span>
            <span className="font-semibold">{value}</span>
        </div>
    );
}

function VehicleMeta({ label, value }: { label: string; value: string }) {
    return (
        <div className="px-5 py-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.5_0.012_70)]">
                {label}
            </div>
            <div className="mt-1 font-semibold">{value}</div>
        </div>
    );
}

function EmptyState({ title, text }: { title: string; text: string }) {
    return (
        <div className="rounded-3xl bg-[oklch(0.94_0.01_80)] p-8 text-center">
            <Wrench className="mx-auto h-6 w-6 text-[oklch(0.45_0.012_70)]" />
            <div className="mt-3 font-semibold">{title}</div>
            <div className="mt-1 text-sm text-[oklch(0.5_0.012_70)]">{text}</div>
        </div>
    );
}

function Field({
    label,
    value,
    onChange,
    type = "text",
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
}) {
    return (
        <label className="block">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.5_0.012_70)]">
                {label}
            </span>
            <input
                required
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[oklch(0.88_0.012_80)] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
            />
        </label>
    );
}

function SelectField({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}) {
    return (
        <label className="block">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.5_0.012_70)]">
                {label}
            </span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[oklch(0.88_0.012_80)] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
            >
                {options.map((option) => (
                    <option key={option}>{option}</option>
                ))}
            </select>
        </label>
    );
}

function TextArea({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="block md:col-span-2">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.5_0.012_70)]">
                {label}
            </span>
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 min-h-28 w-full rounded-2xl border border-[oklch(0.88_0.012_80)] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
            />
        </label>
    );
}

function PrimaryButton({
    icon: Icon,
    label,
    type = "submit",
    onClick,
    variant = "solid",
}: {
    icon: LucideIcon;
    label: string;
    type?: "button" | "submit";
    onClick?: () => void;
    variant?: "solid" | "outline";
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition ${variant === "outline"
                    ? "border border-[oklch(0.88_0.012_80)] bg-white text-[oklch(0.205_0.012_60)] hover:bg-[oklch(0.94_0.01_80)]"
                    : "bg-[oklch(0.205_0.012_60)] text-white hover:opacity-90"
                }`}
        >
            <Icon className="h-4 w-4" />
            {label}
        </button>
    );
}


