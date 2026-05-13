import api from "./axios";

const CUSTOMER_STORE_KEY = "axleworks_customers";
const ACTIVITY_STORE_KEY = "axleworks_customer_activity";
const AUTH_STORE_KEY = "axleworks_auth_users";

export type Vehicle = {
    id: string;
    vehicleNumber: string;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleYear: string;
};

export type CustomerProfile = {
    id: string;
    customerId?: number;
    fullName: string;
    email: string;
    phone: string;
    creditBalance: number;
    creditDueDate: string;
    totalSpend: number;
    vehicles: Vehicle[];
};

export type Appointment = {
    id: string;
    customerName: string;
    vehicleNumber: string;
    serviceType: string;
    preferredDate: string;
    notes: string;
    status: "Pending" | "Confirmed" | "Completed";
};

export type PartRequest = {
    id: string;
    customerName: string;
    partName: string;
    vehicleModel: string;
    urgency: "Normal" | "Urgent";
    status: "Requested" | "Sourcing" | "Arrived";
};

export type AvailablePart = {
    partId: number;
    partName: string;
    price: number;
    stockQuantity: number;
    vendorName?: string;
    imageUrl?: string;
    vehicleBrand?: string;
    vehicleModel?: string;
};

export type ServiceReview = {
    id: string;
    serviceName: string;
    rating: number;
    comment: string;
    createdAt: string;
};

export type CustomerActivity = {
    appointments: Appointment[];
    partRequests: PartRequest[];
    reviews: ServiceReview[];
    history: {
        id: string;
        type: "Purchase" | "Service";
        title: string;
        date: string;
        amount: number;
        status: string;
    }[];
};

export type EsewaPaymentInitiation = {
    saleId: number;
    formAction: string;
    method: string;
    fields: Record<string, string>;
};

const ESEWA_TEST_FORM_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
const ESEWA_TEST_PRODUCT_CODE = "EPAYTEST";
const ESEWA_TEST_SECRET = "8gBm/:&EnhH.1/q";
const ESEWA_SIGNED_FIELD_NAMES = "total_amount,transaction_uuid,product_code";

type RegisterPayload = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    vehicleNumber: string;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleYear: string;
};

type LocalAuthUser = {
    userId: string;
    customerId?: number;
    email: string;
    fullName: string;
    password: string;
    roles: string[];
};

type AuthResponse = {
    userId?: string;
    customerId?: number;
    email?: string;
    fullName?: string;
    roles?: string[];
    token?: string;
};

type BackendVehicle = {
    vehicleId?: number;
    vehicleNumber?: string;
    model?: string;
    vehicleModel?: string;
    brand?: string;
    vehicleBrand?: string;
    year?: number;
    vehicleYear?: number;
};

type BackendCustomer = {
    customerId?: number;
    fullName?: string;
    email?: string;
    phone?: string;
    vehicles?: BackendVehicle[];
};

type BackendSale = {
    saleId?: number;
    saleDate?: string;
    finalAmount?: number;
    subTotal?: number;
    discountAmount?: number;
    paymentStatus?: string;
};

type BackendBooking = {
    serviceBookingId?: number;
    customerId?: number;
    vehicleNumber?: string;
    appointmentDate?: string;
    notes?: string;
    status?: string;
    createdAt?: string;
};

type BackendPartRequest = {
    partRequestId?: number;
    customerId?: number;
    partName?: string;
    vehicleModel?: string;
    details?: string;
    status?: string;
    requestedAt?: string;
};

type BackendPart = {
    partId?: number;
    partName?: string;
    price?: number;
    stockQuantity?: number;
    vendorName?: string;
    imageUrl?: string;
    vehicleBrand?: string;
    vehicleModel?: string;
};

type BackendReview = {
    serviceReviewId?: number;
    customerId?: number;
    rating?: number;
    comment?: string;
    reviewedAt?: string;
};

const createId = (prefix: string) =>
    `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const readCustomers = (): CustomerProfile[] => {
    const saved = localStorage.getItem(CUSTOMER_STORE_KEY);
    if (!saved) return [];

    try {
        return JSON.parse(saved) as CustomerProfile[];
    } catch {
        return [];
    }
};

const writeCustomers = (customers: CustomerProfile[]) => {
    localStorage.setItem(CUSTOMER_STORE_KEY, JSON.stringify(customers));
};

const readAuthUsers = (): LocalAuthUser[] => {
    const saved = localStorage.getItem(AUTH_STORE_KEY);
    if (!saved) return [];

    try {
        return JSON.parse(saved) as LocalAuthUser[];
    } catch {
        return [];
    }
};

const writeAuthUsers = (users: LocalAuthUser[]) => {
    localStorage.setItem(AUTH_STORE_KEY, JSON.stringify(users));
};

const createLocalCustomer = (payload: RegisterPayload): CustomerProfile => ({
    id: createId("customer"),
    fullName: payload.fullName,
    email: payload.email.trim(),
    phone: payload.phone,
    creditBalance: 0,
    creditDueDate: "",
    totalSpend: 0,
    vehicles: [
        {
            id: createId("vehicle"),
            vehicleNumber: payload.vehicleNumber,
            vehicleBrand: payload.vehicleBrand,
            vehicleModel: payload.vehicleModel,
            vehicleYear: payload.vehicleYear,
        },
    ],
});

const saveLocalRegistration = (
    payload: RegisterPayload,
    customer: CustomerProfile,
    auth?: AuthResponse
) => {
    const email = payload.email.trim();
    const customers = readCustomers();
    writeCustomers([
        customer,
        ...customers.filter((item) => item.email.trim().toLowerCase() !== email.toLowerCase()),
    ]);

    const authUsers = readAuthUsers();
    writeAuthUsers([
        {
            userId: auth?.userId ?? customer.id,
            customerId: auth?.customerId ?? customer.customerId,
            email,
            fullName: auth?.fullName ?? payload.fullName,
            password: payload.password,
            roles: auth?.roles ?? ["Customer"],
        },
        ...authUsers.filter((item) => item.email.trim().toLowerCase() !== email.toLowerCase()),
    ]);
};

const readActivity = (): CustomerActivity => {
    const saved = localStorage.getItem(ACTIVITY_STORE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved) as CustomerActivity;
        } catch {
            localStorage.removeItem(ACTIVITY_STORE_KEY);
        }
    }

    return {
        appointments: [
            {
                id: "apt-demo-1",
                customerName: "Demo Customer",
                vehicleNumber: "BA-01-PA-1234",
                serviceType: "Full service",
                preferredDate: new Date().toISOString().slice(0, 10),
                notes: "Engine oil, brake inspection, and wash.",
                status: "Confirmed",
            },
        ],
        partRequests: [
            {
                id: "part-demo-1",
                customerName: "Demo Customer",
                partName: "Toyota Corolla headlight assembly",
                vehicleModel: "Corolla 2020",
                urgency: "Normal",
                status: "Sourcing",
            },
        ],
        reviews: [
            {
                id: "review-demo-1",
                serviceName: "Brake service",
                rating: 5,
                comment: "Clean work and clear billing.",
                createdAt: new Date().toISOString(),
            },
        ],
        history: [
            {
                id: "hist-demo-1",
                type: "Service",
                title: "Full service package",
                date: "2026-04-05",
                amount: 4200,
                status: "Paid",
            },
            {
                id: "hist-demo-2",
                type: "Purchase",
                title: "Engine oil and filter",
                date: "2026-03-18",
                amount: 6200,
                status: "Paid with loyalty discount",
            },
        ],
    };
};

const writeActivity = (activity: CustomerActivity) => {
    localStorage.setItem(ACTIVITY_STORE_KEY, JSON.stringify(activity));
};

const toVehicle = (vehicle: BackendVehicle): Vehicle => ({
    id: `${vehicle.vehicleId ?? createId("vehicle")}`,
    vehicleNumber: vehicle.vehicleNumber ?? "",
    vehicleBrand: vehicle.brand ?? vehicle.vehicleBrand ?? "",
    vehicleModel: vehicle.model ?? vehicle.vehicleModel ?? "",
    vehicleYear: `${vehicle.year ?? vehicle.vehicleYear ?? ""}`,
});

const toProfile = (
    customer: BackendCustomer,
    sales: BackendSale[] = [],
    vehicles = customer.vehicles ?? []
): CustomerProfile => {
    const creditSales = sales.filter(
        (sale) => sale.paymentStatus === "Pending" || sale.paymentStatus === "Credit"
    );
    const creditDueDate = creditSales[0]?.saleDate ?? "";

    return {
        id: `${customer.customerId ?? customer.email ?? createId("customer")}`,
        customerId: customer.customerId,
        fullName: customer.fullName ?? "",
        email: customer.email ?? "",
        phone: customer.phone ?? "",
        creditBalance: creditSales.reduce(
            (total, sale) => total + Number(sale.finalAmount ?? sale.subTotal ?? 0),
            0
        ),
        creditDueDate,
        totalSpend: sales.reduce(
            (total, sale) => total + Number(sale.finalAmount ?? sale.subTotal ?? 0),
            0
        ),
        vehicles: vehicles.map(toVehicle),
    };
};

const toAppointment = (booking: BackendBooking, customerName = "Customer"): Appointment => ({
    id: `${booking.serviceBookingId ?? createId("apt")}`,
    customerName,
    vehicleNumber: booking.vehicleNumber ?? "",
    serviceType: "Vehicle service",
    preferredDate: (booking.appointmentDate ?? new Date().toISOString()).slice(0, 10),
    notes: booking.notes ?? "",
    status: booking.status === "Completed"
        ? "Completed"
        : booking.status === "Confirmed"
            ? "Confirmed"
            : "Pending",
});

const toPartRequest = (request: BackendPartRequest, customerName = "Customer"): PartRequest => ({
    id: `${request.partRequestId ?? createId("part")}`,
    customerName,
    partName: request.partName ?? "",
    vehicleModel: request.vehicleModel ?? "",
    urgency: request.details?.toLowerCase().includes("urgent") ? "Urgent" : "Normal",
    status: request.status === "Arrived"
        ? "Arrived"
        : request.status === "Sourcing"
            ? "Sourcing"
            : "Requested",
});

const toAvailablePart = (part: BackendPart): AvailablePart => ({
    partId: part.partId ?? Number(createId("catalog").replace(/\D/g, "").slice(-8)),
    partName: part.partName ?? "Vehicle part",
    price: Number(part.price ?? 0),
    stockQuantity: Number(part.stockQuantity ?? 0),
    vendorName: part.vendorName,
    imageUrl: part.imageUrl,
    vehicleBrand: part.vehicleBrand,
    vehicleModel: part.vehicleModel,
});

const toReview = (review: BackendReview): ServiceReview => ({
    id: `${review.serviceReviewId ?? createId("review")}`,
    serviceName: "Vehicle service",
    rating: review.rating ?? 5,
    comment: review.comment ?? "",
    createdAt: review.reviewedAt ?? new Date().toISOString(),
});

export const registerCustomer = async (payload: RegisterPayload) => {
    const localCustomer = createLocalCustomer(payload);
    const registration = {
        fullName: payload.fullName,
        email: payload.email.trim(),
        password: payload.password,
        phone: payload.phone,
        vehicleNumber: payload.vehicleNumber,
        vehicleBrand: payload.vehicleBrand,
        vehicleModel: payload.vehicleModel,
        vehicleYear: payload.vehicleYear ? Number(payload.vehicleYear) : null,
    };

    try {
        const response = await api.post<AuthResponse>("/auth/register", registration);
        saveLocalRegistration(payload, localCustomer, response.data);
        return response.data;
    } catch {
        saveLocalRegistration(payload, localCustomer);
        return localCustomer;
    }
};

export const getCustomers = async () => {
    try {
        const response = await api.get<BackendCustomer[]>("/Customer");
        const customers = response.data;

        return await Promise.all(
            customers.map(async (customer) => {
                const customerId = customer.customerId;
                if (!customerId) return toProfile(customer);

                const [vehiclesResponse, salesResponse] = await Promise.allSettled([
                    api.get<BackendVehicle[]>(`/Customer/${customerId}/vehicles`),
                    api.get<BackendSale[]>(`/sales/customer/${customerId}`),
                ]);

                const vehicles =
                    vehiclesResponse.status === "fulfilled"
                        ? vehiclesResponse.value.data
                        : [];
                const sales =
                    salesResponse.status === "fulfilled"
                        ? salesResponse.value.data
                        : [];

                return toProfile(customer, sales, vehicles);
            })
        );
    } catch {
        return readCustomers();
    }
};

export const getCustomerProfile = async (email?: string, customerId?: number) => {
    try {
        if (!customerId) throw new Error("Customer ID missing");

        const [profileResponse, salesResponse] = await Promise.allSettled([
            api.get<BackendCustomer>(`/customer-profile/${customerId}`),
            api.get<BackendSale[]>("/sales/my-history"),
        ]);

        if (profileResponse.status !== "fulfilled") {
            throw new Error("Profile request failed");
        }

        const sales =
            salesResponse.status === "fulfilled"
                ? salesResponse.value.data
                : [];

        return toProfile(profileResponse.value.data, sales, profileResponse.value.data.vehicles);
    } catch {
        const customers = readCustomers();
        const existing = customers.find((item) => item.email === email);
        if (existing) return existing;

        const fallback: CustomerProfile = {
            id: "customer-demo",
            fullName: "Demo Customer",
            email: email ?? "customer@example.com",
            phone: "9800000000",
            creditBalance: 3500,
            creditDueDate: "2026-03-20",
            totalSpend: 10400,
            vehicles: [
                {
                    id: "vehicle-demo",
                    vehicleNumber: "BA-01-PA-1234",
                    vehicleBrand: "Toyota",
                    vehicleModel: "Corolla",
                    vehicleYear: "2020",
                },
            ],
        };

        writeCustomers([fallback, ...customers]);
        return fallback;
    }
};

export const saveCustomerProfile = async (profile: CustomerProfile) => {
    try {
        if (!profile.customerId) throw new Error("Customer ID missing");

        const response = await api.put<BackendCustomer>(
            `/customer-profile/${profile.customerId}`,
            {
                fullName: profile.fullName,
                phone: profile.phone,
                email: profile.email,
            }
        );

        return toProfile(response.data, [], response.data.vehicles);
    } catch {
        const customers = readCustomers();
        writeCustomers(customers.map((item) => (item.id === profile.id ? profile : item)));
        return profile;
    }
};

export const addCustomerVehicle = async (
    customerId: number,
    vehicle: Vehicle
) => {
    const response = await api.post<BackendVehicle>("/Customer/vehicle", {
        customerId,
        vehicleNumber: vehicle.vehicleNumber,
        model: [vehicle.vehicleBrand, vehicle.vehicleModel, vehicle.vehicleYear]
            .filter(Boolean)
            .join(" "),
    });

    return toVehicle(response.data);
};

export const getCustomerActivity = async (customerId?: number, customerName = "Customer") => {
    try {
        if (!customerId) throw new Error("Customer ID missing");

        const [bookingResponse, requestResponse, reviewResponse, salesResponse] =
            await Promise.allSettled([
                api.get<BackendBooking[]>(`/customer-bookings/customer/${customerId}`),
                api.get<BackendPartRequest[]>(`/customer-requests/customer/${customerId}`),
                api.get<BackendReview[]>(`/customer-reviews/customer/${customerId}`),
                api.get<BackendSale[]>("/sales/my-history"),
            ]);

        const bookings =
            bookingResponse.status === "fulfilled" ? bookingResponse.value.data : [];
        const requests =
            requestResponse.status === "fulfilled" ? requestResponse.value.data : [];
        const reviews =
            reviewResponse.status === "fulfilled" ? reviewResponse.value.data : [];
        const sales =
            salesResponse.status === "fulfilled" ? salesResponse.value.data : [];

        return {
            appointments: bookings.map((booking) => toAppointment(booking, customerName)),
            partRequests: requests.map((request) => toPartRequest(request, customerName)),
            reviews: reviews.map(toReview),
            history: [
                ...sales.map((sale) => ({
                    id: `${sale.saleId ?? createId("sale")}`,
                    type: "Purchase" as const,
                    title: `Sale #${sale.saleId ?? ""}`.trim(),
                    date: (sale.saleDate ?? new Date().toISOString()).slice(0, 10),
                    amount: Number(sale.finalAmount ?? sale.subTotal ?? 0),
                    status: sale.paymentStatus ?? "Paid",
                })),
                ...bookings.map((booking) => ({
                    id: `${booking.serviceBookingId ?? createId("booking")}`,
                    type: "Service" as const,
                    title: booking.notes || "Service booking",
                    date: (booking.appointmentDate ?? new Date().toISOString()).slice(0, 10),
                    amount: 0,
                    status: booking.status ?? "Pending",
                })),
            ],
        };
    } catch {
        return readActivity();
    }
};

export const getAvailableParts = async () => {
    try {
        const response = await api.get<BackendPart[]>("/Part");
        return response.data
            .map(toAvailablePart)
            .filter((part) => part.stockQuantity > 0);
    } catch {
        return [] as AvailablePart[];
    }
};

export const bookAppointment = async (
    appointment: Omit<Appointment, "id" | "status">,
    customerId?: number
) => {
    try {
        if (!customerId) throw new Error("Customer ID missing");

        const response = await api.post<BackendBooking>("/customer-bookings", {
            customerId,
            vehicleNumber: appointment.vehicleNumber,
            appointmentDate: appointment.preferredDate,
            notes: `${appointment.serviceType}${appointment.notes ? ` - ${appointment.notes}` : ""}`,
        });

        return toAppointment(response.data, appointment.customerName);
    } catch {
        const activity = readActivity();
        const created: Appointment = {
            ...appointment,
            id: createId("apt"),
            status: "Pending",
        };
        writeActivity({
            ...activity,
            appointments: [created, ...activity.appointments],
        });
        return created;
    }
};

export const requestPart = async (
    request: Omit<PartRequest, "id" | "status">,
    customerId?: number
) => {
    try {
        if (!customerId) throw new Error("Customer ID missing");

        const response = await api.post<BackendPartRequest>("/customer-requests", {
            customerId,
            partName: request.partName,
            vehicleModel: request.vehicleModel,
            details: request.urgency,
        });

        return toPartRequest(response.data, request.customerName);
    } catch {
        const activity = readActivity();
        const created: PartRequest = {
            ...request,
            id: createId("part"),
            status: "Requested",
        };
        writeActivity({
            ...activity,
            partRequests: [created, ...activity.partRequests],
        });
        return created;
    }
};

export const submitReview = async (
    review: Omit<ServiceReview, "id" | "createdAt">,
    customerId?: number
) => {
    try {
        if (!customerId) throw new Error("Customer ID missing");

        const response = await api.post<BackendReview>("/customer-reviews", {
            customerId,
            rating: review.rating,
            comment: `${review.serviceName}${review.comment ? ` - ${review.comment}` : ""}`,
        });

        return toReview(response.data);
    } catch {
        const activity = readActivity();
        const created: ServiceReview = {
            ...review,
            id: createId("review"),
            createdAt: new Date().toISOString(),
        };
        writeActivity({
            ...activity,
            reviews: [created, ...activity.reviews],
        });
        return created;
    }
};

export const calculateLoyaltyDiscount = (amount: number) => {
    const discount = amount > 5000 ? amount * 0.1 : 0;
    return {
        discount,
        payable: amount - discount,
    };
};

export const initiateEsewaPayment = async (saleId: number) => {
    const response = await api.post<EsewaPaymentInitiation>(
        `/esewa/sales/${saleId}/initiate`,
        {
            taxAmount: 0,
            productServiceCharge: 0,
            productDeliveryCharge: 0,
        },
        {
            timeout: 1500,
        }
    );

    return response.data;
};

export const initiateDirectEsewaPayment = async (amount: number) => {
    const response = await api.post<EsewaPaymentInitiation>(
        "/esewa/initiate",
        {
            amount,
            taxAmount: 0,
            productServiceCharge: 0,
            productDeliveryCharge: 0,
        },
        {
            timeout: 1500,
        }
    );

    return response.data;
};

export const createEsewaPayment = async (amount: number) => {
    return createLocalEsewaTestPayment(amount);
};

const createLocalEsewaTestPayment = async (amount: number): Promise<EsewaPaymentInitiation> => {
    const safeAmount = Math.max(Number(amount) || 0, 1);
    const formattedAmount = formatEsewaAmount(safeAmount);
    const transactionUuid = `AXLEWORKS-${Date.now()}`;
    const message = `total_amount=${formattedAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_TEST_PRODUCT_CODE}`;
    const signature = await signEsewaMessage(message);
    const callbackUrl = `${window.location.origin}/customer/payments`;

    return {
        saleId: 0,
        formAction: ESEWA_TEST_FORM_URL,
        method: "POST",
        fields: {
            amount: formattedAmount,
            tax_amount: "0",
            total_amount: formattedAmount,
            transaction_uuid: transactionUuid,
            product_code: ESEWA_TEST_PRODUCT_CODE,
            product_service_charge: "0",
            product_delivery_charge: "0",
            success_url: `${callbackUrl}?payment=success`,
            failure_url: `${callbackUrl}?payment=failed`,
            signed_field_names: ESEWA_SIGNED_FIELD_NAMES,
            signature,
        },
    };
};

const signEsewaMessage = async (message: string) => {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(ESEWA_TEST_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));

    return btoa(String.fromCharCode(...new Uint8Array(signature)));
};

const formatEsewaAmount = (amount: number) =>
    amount.toFixed(2).replace(/\.?0+$/, "");
