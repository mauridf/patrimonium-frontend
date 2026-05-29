export type PropertyType = 'Residential' | 'Commercial' | 'Vacation' | 'Industrial' | 'Rural' | 'Other';
export type PropertyPurpose = 'Rent' | 'Sale' | 'Both' | 'Other';
export type PropertyCategory = 'House' | 'Apartment' | 'CommercialRoom' | 'Land' | 'Warehouse' | 'Store' | 'Farm' | 'Other';

export interface PropertyImage {
  id: string;
  fileName: string;
  filePath: string;
  contentType: string;  // image/jpeg, image/png, etc.
  fileSize: number;     // bytes
  displayOrder: number; // 1 = principal
  url: string;
}

export interface Property {
  id: string;           // UUID
  ownerId: string;      // UUID do User
  name: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  category: PropertyCategory;
  address?: string;
  number?: string;
  complement?: string;
  city?: string;
  state?: string;       // 2 caracteres: SP, RJ, etc.
  zipCode?: string;     // 8 dígitos
  bedrooms: number;
  bathrooms: number;
  suites: number;
  parkingSpots: number;
  totalArea: number;    // m²
  builtArea: number;    // m²
  floor?: number;
  furnished: boolean;
  description?: string;
  estimatedValue: number;
  initialValue: number;
  actualValue: number;
  salesValue?: number;
  rentValue?: number;
  condoFee?: number;
  iptu?: number;
  availableForRent: boolean;
  availableForSale: boolean;
  roi: number;          // Percentual (ex: 4.2 = 4.2%)
  yield: number;        // Percentual (ex: 4.8 = 4.8%)
  active: boolean;
  createdAt: string;
  images: PropertyImage[];
}

export interface CreatePropertyRequest {
  name: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  category: PropertyCategory;
  address?: string;
  number?: string;
  complement?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  bedrooms?: number;
  bathrooms?: number;
  suites?: number;
  parkingSpots?: number;
  totalArea?: number;
  builtArea?: number;
  floor?: number;
  furnished?: boolean;
  description?: string;
  estimatedValue: number;
  initialValue: number;
  salesValue?: number;
  rentValue?: number;
  condoFee?: number;
  iptu?: number;
  availableForRent?: boolean;
  availableForSale?: boolean;
}