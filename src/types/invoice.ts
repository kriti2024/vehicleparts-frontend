export interface Invoice {
  invoiceId?: number;
  invoiceNumber?: string;
  saleId?: number;
  invoiceDate?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  subTotal?: number;
  totalAmount?: number;
  discountPercent?: number;
  discountAmount?: number;
  finalAmount?: number;
  createdAt?: string;
  paymentStatus?: string;
}
