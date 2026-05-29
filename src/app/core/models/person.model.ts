export type PersonType = 'Owner' | 'Broker' | 'Tenant' | 'Guarantor' | 'Buyer' | 'Other';

export interface Person {
  id: string;           // UUID
  userId: string;       // UUID do User
  fullName: string;     // Nome completo
  document: string;     // CPF (11) ou CNPJ (14)
  type: PersonType;
  email?: string;
  phone?: string;
  birthDate?: string;   // YYYY-MM-DD
  active: boolean;
  createdAt: string;    // ISO 8601 UTC
}

export interface CreatePersonRequest {
  fullName: string;
  document: string;
  type: PersonType;
  email?: string;
  phone?: string;
  birthDate?: string;
}

// Type alias para update (mesmo que create)
export type UpdatePersonRequest = CreatePersonRequest;