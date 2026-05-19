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
    return response.data;
};