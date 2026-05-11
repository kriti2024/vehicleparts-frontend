export interface CustomerSummary {
  customerId: number;
  fullName: string;
  email: string;
  phone: string;
  totalPurchases: number;
  totalSpent: number;
  pendingAmount: number;
}

export interface CustomerReport {
  regularCustomers: CustomerSummary[];
  highSpenders: CustomerSummary[];
  pendingCreditCustomers: CustomerSummary[];
}
