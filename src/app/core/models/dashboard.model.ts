export interface DashboardSummary {
  totalProperties: number;
  activeContracts: number;
  monthlyRentRevenue: number;
  monthlyExpenses: number;
  overdueAmount: number;
  overdueCount: number;
  averageROI: number;
  averageYield: number;
}

export interface OverdueReport {
  transactionId: string;
  propertyId: string;
  propertyName: string;
  amount: number;
  type: string;
  dueDate: string;
  daysOverdue: number;
}

export interface ROIReport {
  propertyId: string;
  propertyName: string;
  estimatedValue: number;
  roi: number;
  yield: number;
  annualRent: number;
  annualExpenses: number;
}