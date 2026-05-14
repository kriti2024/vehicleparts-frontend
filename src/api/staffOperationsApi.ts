import api from "./axios";

export type ServiceJob = {
  id: string;
  customer: string;
  vehicle: string;
  service: string;
  date: string;
  priority: "Normal" | "High" | "Urgent";
  status: "Waiting" | "In Progress" | "Ready";
  notes: string;
};

export type CreateServiceJobRequest = {
  customer: string;
  vehicle: string;
  service: string;
  date: string;
  priority: "Normal" | "High" | "Urgent";
  notes?: string;
};

export type CustomerCredit = {
  id: string;
  customer: string;
  phone: string;
  email: string;
  amount: number;
  dueDate: string;
  status: "Pending" | "Promised" | "Paid";
  note: string;
};

export type StockAlert = {
  id: string;
  part: string;
  category: string;
  stock: number;
  reorderLevel: number;
  vendor: string;
  status: "OK" | "Low" | "Critical";
};

export const getServiceQueue = async (): Promise<ServiceJob[]> => {
  const response = await api.get<ServiceJob[]>("/staff-operations/service-queue");
  return response.data;
};

export const createServiceJob = async (
  data: CreateServiceJobRequest,
): Promise<ServiceJob> => {
  const response = await api.post<ServiceJob>("/staff-operations/service-queue", data);
  return response.data;
};

export const updateServiceJobStatus = async (
  id: string,
  status: ServiceJob["status"],
): Promise<ServiceJob> => {
  const response = await api.patch<ServiceJob>(`/staff-operations/service-queue/${id}/status`, { status });
  return response.data;
};

export const getCustomerCredits = async (): Promise<CustomerCredit[]> => {
  const response = await api.get<CustomerCredit[]>("/staff-operations/credits");
  return response.data;
};

export const updateCustomerCredit = async (
  id: string,
  status: CustomerCredit["status"],
  note?: string,
): Promise<CustomerCredit> => {
  const response = await api.patch<CustomerCredit>(`/staff-operations/credits/${id}`, { status, note });
  return response.data;
};

export const getStockAlerts = async (status = "all"): Promise<StockAlert[]> => {
  const response = await api.get<StockAlert[]>("/staff-operations/stock-alerts", {
    params: { status },
  });
  return response.data;
};

export const restockItem = async (id: string): Promise<StockAlert> => {
  const response = await api.patch<StockAlert>(`/staff-operations/stock-alerts/${id}/restock`);
  return response.data;
};
