import api from "./axios";
import type { Invoice } from "../types/invoice";

export const getInvoiceBySaleId = async (saleId: number): Promise<Invoice> => {
  const response = await api.get<Invoice>(`/sales/${saleId}/invoice`);
  return response.data;
};
