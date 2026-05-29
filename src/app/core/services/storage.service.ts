import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // Singleton global
})
export class StorageService {
  
  // Salvar token de acesso
  setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  // Recuperar token de acesso
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Salvar refresh token
  setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
  }

  // Recuperar refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Salvar data de expiração
  setExpiresAt(date: string): void {
    localStorage.setItem('expiresAt', date);
  }

  // Recuperar data de expiração
  getExpiresAt(): string | null {
    return localStorage.getItem('expiresAt');
  }

  // Salvar dados do usuário
  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Recuperar dados do usuário
  getUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    // Verificar se o token não expirou
    const expiresAt = this.getExpiresAt();
    if (expiresAt) {
      const now = new Date();
      const expires = new Date(expiresAt);
      if (now >= expires) {
        this.clearAll();
        return false;
      }
    }

    return true;
  }

  // Limpar todos os dados (logout)
  clearAll(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('user');
  }
}