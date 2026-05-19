import api from "./axios";

export type Vehicle = {
    id: string;
    vehicleId?: number;
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
    serviceBookingId?: number;
    customerName: string;
    vehicleNumber: string;
    serviceType: string;
    preferredDate: string;
    notes: string;
    status: "Pending" | "Confirmed" | "Completed";
};

export type PartRequest = {
    id: string;
    partRequestId?: number;
    customerName: string;
    partName: string;
    vehicleModel: string;
    urgency: "Normal" | "Urgent";
    status: "Requested" | "Sourcing" | "Arrived";
};

export type ServiceReview = {
    id: string;
    serviceReviewId?: number;
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

export type EsewaPaymentInitiation = {
    saleId: number;
    formAction: string;
    method: string;
    fields: Record<string, string>;
};

export const registerCustomer = async (data: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    vehicleNumber: string;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleYear: string;
}) => {
    const response = await api.post("/auth/register", data);
    return response.data;
};

export const getCustomers = async (): Promise<CustomerProfile[]> => {
    const response = await api.get<CustomerProfile[]>("/customer");

    return response.data.map((customer) => ({
        ...customer,
        vehicles: customer.vehicles ?? [],
    }));
};

export const getCustomerProfile = async (
    email?: string,
    customerId?: number
): Promise<CustomerProfile> => {

    if (!customerId) {
        return {
            id: "1",
            fullName: "Demo Customer",
            email: email || "demo@gmail.com",
            phone: "9800000000",
            creditBalance: 0,
            creditDueDate: "",
            totalSpend: 0,
            vehicles: [],
        };
    }

    const response = await api.get(`/customer-profile/${customerId}`);
    return response.data;
};

export const saveCustomerProfile = async (
    profile: CustomerProfile
) => {

    if (!profile.customerId) {
        return profile;
    }

    const response = await api.put(
        `/customer-profile/${profile.customerId}`,
        {
            fullName: profile.fullName,
            phone: profile.phone,
            email: profile.email,
        }
    );

    return response.data;
};

export const addCustomerVehicle = async (
    customerId: number,
    vehicle: Vehicle
): Promise<Vehicle> => {

    const response = await api.post("/customer/vehicle", {
        customerId,
        vehicleNumber: vehicle.vehicleNumber,
        model: `${vehicle.vehicleBrand} ${vehicle.vehicleModel} ${vehicle.vehicleYear}`,
    });

    return {
        id: String(response.data.vehicleId || Date.now()),
        vehicleId: response.data.vehicleId,
        vehicleNumber: response.data.vehicleNumber,
        vehicleBrand: vehicle.vehicleBrand,
        vehicleModel: vehicle.vehicleModel,
        vehicleYear: vehicle.vehicleYear,
    };
};

export const getCustomerActivity = async (
    customerId?: number,
    customerName = "Customer"
): Promise<CustomerActivity> => {

    if (!customerId) {
        return {
            appointments: [],
            partRequests: [],
            reviews: [],
            history: [],
        };
    }

    const [bookings, requests, reviews, sales] =
        await Promise.all([
            api.get(`/customer-bookings/customer/${customerId}`),
            api.get(`/customer-requests/customer/${customerId}`),
            api.get(`/customer-reviews/customer/${customerId}`),
            api.get(`/sales/customer/${customerId}`),
        ]);

    return {
        appointments: bookings.data.map((item: {
            serviceBookingId: number;
            vehicleNumber: string;
            appointmentDate: string;
            notes: string;
            status: "Pending" | "Confirmed" | "Completed";
        }) => ({
            id: String(item.serviceBookingId),
            serviceBookingId: item.serviceBookingId,
            customerName,
            vehicleNumber: item.vehicleNumber,
            serviceType: "Vehicle Service",
            preferredDate: item.appointmentDate,
            notes: item.notes,
            status: item.status || "Pending",
        })),

        partRequests: requests.data.map((item: {
            partRequestId: number;
            partName: string;
            vehicleModel: string;
            status: "Requested" | "Sourcing" | "Arrived";
        }) => ({
            id: String(item.partRequestId),
            partRequestId: item.partRequestId,
            customerName,
            partName: item.partName,
            vehicleModel: item.vehicleModel,
            urgency: "Normal",
            status: item.status || "Requested",
        })),

        reviews: reviews.data.map((item: {
            serviceReviewId: number;
            rating: number;
            comment: string;
            reviewedAt: string;
        }) => ({
            id: String(item.serviceReviewId),
            serviceReviewId: item.serviceReviewId,
            serviceName: "Vehicle Service",
            rating: item.rating,
            comment: item.comment,
            createdAt: item.reviewedAt,
        })),

        history: sales.data.map((item: {
            saleId: number;
            saleDate: string;
            finalAmount: number;
            paymentStatus: string;
        }) => ({
            id: String(item.saleId),
            type: "Purchase",
            title: `Sale #${item.saleId}`,
            date: item.saleDate,
            amount: item.finalAmount,
            status: item.paymentStatus,
        })),
    };
};

export const getAvailableParts = async (): Promise<AvailablePart[]> => {
    const response = await api.get("/part");
    return response.data;
};

export const bookAppointment = async (
    data: {
        customerName: string;
        vehicleNumber: string;
        serviceType: string;
        preferredDate: string;
        notes: string;
    },
    customerId?: number
): Promise<Appointment> => {

    const response = await api.post(
        "/customer-bookings",
        {
            customerId,
            vehicleNumber: data.vehicleNumber,
            appointmentDate: data.preferredDate,
            notes: data.notes,
        }
    );

    return {
        id: String(response.data.serviceBookingId),
        serviceBookingId: response.data.serviceBookingId,
        customerName: data.customerName,
        vehicleNumber: data.vehicleNumber,
        serviceType: data.serviceType,
        preferredDate: data.preferredDate,
        notes: data.notes,
        status: response.data.status || "Pending",
    };
};

export const requestPart = async (
    data: {
        customerName: string;
        partName: string;
        vehicleModel: string;
        urgency: "Normal" | "Urgent";
    },
    customerId?: number
): Promise<PartRequest> => {

    const response = await api.post(
        "/customer-requests",
        {
            customerId,
            partName: data.partName,
            vehicleModel: data.vehicleModel,
            details: data.urgency,
        }
    );

    return {
        id: String(response.data.partRequestId),
        partRequestId: response.data.partRequestId,
        customerName: data.customerName,
        partName: data.partName,
        vehicleModel: data.vehicleModel,
        urgency: data.urgency,
        status: response.data.status || "Requested",
    };
};

export const submitReview = async (
    data: {
        serviceName: string;
        rating: number;
        comment: string;
    },
    customerId?: number
): Promise<ServiceReview> => {

    const response = await api.post(
        "/customer-reviews",
        {
            customerId,
            rating: data.rating,
            comment: data.comment,
        }
    );

    return {
        id: String(response.data.serviceReviewId),
        serviceReviewId: response.data.serviceReviewId,
        serviceName: data.serviceName,
        rating: data.rating,
        comment: data.comment,
        createdAt: new Date().toISOString(),
    };
};

export const calculateLoyaltyDiscount = (amount: number) => {

    const discount = amount > 5000
        ? amount * 0.1
        : 0;

    return {
        discount,
        payable: amount - discount,
    };
};

export const initiateEsewaPayment = async (
    saleId: number
): Promise<EsewaPaymentInitiation> => {

    const response = await api.post(
        `/esewa/sales/${saleId}/initiate`
    );

    return response.data;
};

export const createEsewaPayment = async (
    amount: number
): Promise<EsewaPaymentInitiation> => {

    const response = await api.post(
        "/esewa/initiate",
        {
            amount,
        }
    );

    return response.data;
};
