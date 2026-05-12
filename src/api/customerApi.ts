import api from "./axios";

import type {
  Customer,
  CustomerWithVehicles,
  CreateCustomerRequest,
  CreateVehicleRequest,
  Vehicle,
} from "../types/customer";

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await api.get<Customer[]>("/customer");
  return response.data;
};

export const createCustomer = async (
  data: CreateCustomerRequest,
): Promise<Customer> => {
  const response = await api.post<Customer>("/customer", data);
  return response.data;
};

export const addVehicle = async (
  data: CreateVehicleRequest,
): Promise<Vehicle> => {
  const response = await api.post<Vehicle>("/customer/vehicle", data);
  return response.data;
};

export const getCustomerWithVehicles = async (
  customerId: number,
): Promise<CustomerWithVehicles> => {
  const response = await api.get<CustomerWithVehicles>(
    `/customer/${customerId}/with-vehicles`,
  );

  return response.data;
};

export const searchCustomers = async (keyword: string): Promise<Customer[]> => {
  const response = await api.get<Customer[]>("/customer/search", {
    params: { keyword },
  });

  return response.data;
};
