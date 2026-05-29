export type ContractStatus = 'Active' | 'Paused' | 'Completed' | 'Cancelled';

// Contrato de Locação
export interface RentContract {
  id: string;
  propertyId: string;
  propertyName: string;
  tenantId: string;
  tenantName: string;
  status: ContractStatus;
  startDate: string;    // YYYY-MM-DD
  endDate?: string;     // YYYY-MM-DD
  rentAmount: number;
  dueDay: number;       // 1-31
  penaltyPercentage: number;  // Default: 2.00
  interestPercentage: number; // Default: 1.00
  createdAt: string;
}

export interface CreateRentContractRequest {
  propertyId: string;
  tenantId: string;
  rentAmount: number;
  dueDay: number;
  startDate: string;
  endDate?: string;
  penaltyPercentage?: number;
  interestPercentage?: number;
}

// Contrato de Venda
export interface SaleContract {
  id: string;
  propertyId: string;
  propertyName: string;
  buyerId: string;
  buyerName: string;
  status: ContractStatus;
  startDate: string;
  saleAmount: number;
  installments?: number;
  dueDay?: number;      // 1-31
  discountPercentage?: number;
  createdAt: string;
}

export interface CreateSaleContractRequest {
  propertyId: string;
  buyerId: string;
  saleAmount: number;
  startDate: string;
  installments?: number;
  dueDay?: number;
  discountPercentage?: number;
}