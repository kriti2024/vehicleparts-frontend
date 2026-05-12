import api from "./axios";
import type { CustomerReport } from "../types/report";

export const getCustomerReports = async (): Promise<CustomerReport> => {
  const response = await api.get<CustomerReport>(
    "/StaffReport/customer-reports",
  );

  return response.data;
};
