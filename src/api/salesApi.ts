import api from "./axios";
import type { CreateSaleRequest, Sale } from "../types/sale";

export const createSale = async (data: CreateSaleRequest): Promise<Sale> => {
  const response = await api.post<Sale>("/sales", data);
  return response.data;
};

export const getSaleById = async (saleId: number): Promise<Sale> => {
  const response = await api.get<Sale>(`/sales/${saleId}`);
  return response.data;
};

export const getCustomerSales = async (customerId: number): Promise<Sale[]> => {
  const response = await api.get<Sale[]>(`/sales/customer/${customerId}`);
  return response.data;
};
