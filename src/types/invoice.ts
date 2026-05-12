export interface Invoice {
  invoiceId?: number;
  invoiceNumber?: string;
  saleId?: number;
  customerName?: string;
  totalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  createdAt?: string;
}
