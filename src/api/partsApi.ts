import api from "./axios";

export interface PartOption {
  partId: number;
  partName: string;
  price: number;
  stockQuantity: number;
  vendorName?: string;
}

export const getParts = async (): Promise<PartOption[]> => {
  const response = await api.get<PartOption[]>("/part");
  if (response.data.length > 0) return response.data;

  return [
    { partId: 101, partName: "Brake Pad Set", price: 3200, stockQuantity: 14, vendorName: "Axleworks Stock" },
    { partId: 102, partName: "Engine Oil 5W-30", price: 1850, stockQuantity: 18, vendorName: "Axleworks Stock" },
    { partId: 103, partName: "Spark Plug", price: 950, stockQuantity: 24, vendorName: "Axleworks Stock" },
    { partId: 104, partName: "Air Filter", price: 780, stockQuantity: 8, vendorName: "Axleworks Stock" },
    { partId: 107, partName: "Car Battery", price: 7600, stockQuantity: 6, vendorName: "Axleworks Stock" },
  ];
};
