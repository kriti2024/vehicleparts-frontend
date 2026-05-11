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
  totalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  createdAt?: string;
}
