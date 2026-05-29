export interface User {
  id: string;           // UUID
  email: string;        // Email único
  name: string;         // Nome completo
  type: 'Admin' | 'Client';
  active: boolean;      // Soft delete
  createdAt: string;    // ISO 8601 UTC
  lastLoginAt?: string; // ISO 8601 UTC
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;    // ISO 8601 UTC
}

export interface RefreshTokenRequest {
  refreshToken: string;
}