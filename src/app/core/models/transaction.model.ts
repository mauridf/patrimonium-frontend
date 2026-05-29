export type TransactionType = 'Rent' | 'Penalty' | 'Interest' | 'Expense' | 'Sale';
export type TransactionStatus = 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';

export interface Transaction {
  id: string;
  propertyId: string;
  propertyName: string;
  contractId?: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  transactionDate: string;
  dueDate: string;      // YYYY-MM-DD
  paymentDate?: string;
  description?: string;
  paid: boolean;
  referenceTransactionId?: string;
  dependentTransactions: Transaction[];
  createdAt: string;
}

export interface CreateTransactionRequest {
  propertyId: string;
  amount: number;
  type: TransactionType;
  dueDate: string;
  contractId?: string;
  referenceTransactionId?: string;
  description?: string;
}

export interface PayTransactionRequest {
  paymentDate: string;  // ISO 8601 UTC
}