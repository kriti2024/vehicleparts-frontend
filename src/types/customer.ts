export interface Customer {
  customerId: number;
  fullName: string;
  phone: string;
  email?: string;
}

export interface Vehicle {
  vehicleId: number;
  vehicleNumber: string;
  model: string;
  customerId: number;
  customerName: string;
}

export interface CustomerWithVehicles {
  customerId: number;
  fullName: string;
  phone: string;
  email?: string;
  vehicles: Vehicle[];
}

export interface CreateCustomerRequest {
  fullName: string;
  phone: string;
  email: string;
  password: string;
}

export interface CreateVehicleRequest {
  customerId: number;
  vehicleNumber: string;
  model: string;
}
