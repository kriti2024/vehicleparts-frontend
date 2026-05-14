export interface SaleItemRequest {
  partId: number;
  quantity: number;
}

export interface CreateSaleRequest {
  customerId: number;
  items: SaleItemRequest[];
}

export interface Sale {
  saleId: number;
  customerId?: number;
  customerName?: string;
  saleDate?: string;
  subTotal?: number;
  totalAmount?: number;
  discountPercent?: number;
  discountAmount?: number;
  finalAmount?: number;
  createdAt?: string;
  paymentStatus?: string;
}
