import api from "./axios";

export type ReportSummary = {
    dailySales: number;
    monthlySales: number;
    yearlySales: number;
    dailyInvoices: number;
    monthlyInvoices: number;
    yearlyInvoices: number;
};

export type MonthlyRevenue = {
    month: string;
    sales: number;
    invoices: number;
};

export const getReportSummary = async () => {

    const response =
        await api.get<ReportSummary>(
            "/admin/reports/summary"
        );

    return response.data;
};

export const getDailyReport = async () => {

    const response =
        await api.get(
            "/admin/reports/daily"
        );

    return response.data;
};

export const getMonthlyReport = async () => {

    const response =
        await api.get(
            "/admin/reports/monthly"
        );

    return response.data;
};

export const getMonthlyRevenue = async () => {

    const response =
        await api.get<MonthlyRevenue[]>(
            "/admin/reports/monthly-revenue"
        );

    return response.data;
};

export const getYearlyReport = async () => {

    const response =
        await api.get(
            "/admin/reports/yearly"
        );

    return response.data;
};

export const getLowStockParts = async () => {

    const response = await api.get(
        "/Part/low-stock"
    );

    return response.data;
};

export const getAllParts = async () => {

    const response =
        await api.get("/Part");

    return response.data;
};

export const createPart = async (
    formData: FormData
) => {

    const response =
        await api.post(
            "/Part",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );

    return response.data;
};

export const updatePart = async (
    id: number,
    formData: FormData
) => {

    const response =
        await api.put(
            `/Part/${id}`,
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );

    return response.data;
};

export const deletePart = async (
    id: number
) => {

    const response =
        await api.delete(
            `/Part/${id}`
        );

    return response.data;
};

export const getAllVendors = async () => {

    const response =
        await api.get("/Vendor");

    return response.data;
};

/* GET BY ID */
export const getVendorById = async (
    id: number
) => {

    const response =
        await api.get(
            `/Vendor/${id}`
        );

    return response.data;
};

/* CREATE */
export const createVendor = async (
    vendorData: {
        vendorName: string;
        email: string;
        phoneNumber: string;
        address: string;
    }
) => {

    const response =
        await api.post(
            "/Vendor",
            vendorData
        );

    return response.data;
};

/* UPDATE */
export const updateVendor = async (
    id: number,
    vendorData: {
        vendorId: number;
        vendorName: string;
        email: string;
        phoneNumber: string;
        address: string;
    }
) => {

    await api.put(
        `/Vendor/${id}`,
        vendorData
    );
};

/* DELETE */
export const deleteVendor = async (
    id: number
) => {

    await api.delete(
        `/Vendor/${id}`
    );
};

export const getAllStaff = async () => {

    const response =
        await api.get("/admin/staff");

    return response.data;
};

export const createStaff = async (
    data: {
        fullName: string;
        email: string;
        password: string;
        role: string;
    }
) => {

    const response =
        await api.post(
            "/admin/staff",
            data
        );

    return response.data;
};

export const deleteStaff = async (
    id: string
) => {

    await api.delete(
        `/admin/staff/${id}`
    );
};

export const changeStaffRole = async (
    id: string,
    role: string
) => {

    await api.put(
        `/admin/staff/${id}/role`,
        { role }
    );
};

export const getAllPurchaseInvoices = async () => {

    const response =
        await api.get("/Purchase");

    return response.data;
};

export const getPurchaseInvoiceById = async (
    id: number
) => {

    const response =
        await api.get(
            `/Purchase/${id}`
        );

    return response.data;
};

export const sendCreditReminders = async () => {
const response =
    await api.post(
        "/Notification/send-credit-reminders"
    );

return response.data;

};

export const sendLowStockAlerts = async () => {

const response =
    await api.get(
        "/Part/low-stock"
    );

return {
    message:
        `${response.data.length} low stock part(s) found. Admin dashboard has been updated.`,
    parts: response.data,
};

};
