import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@env/environment';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User,
  RefreshTokenRequest 
} from '@app/core/models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  // Login
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  // Registro
  register(data: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, data);
  }

  // Renovar token
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.storageService.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('Refresh token não encontrado');
    }

    const body: RefreshTokenRequest = { refreshToken };

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, body)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  // Obter perfil do usuário
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  // Logout
  logout(): void {
    this.storageService.clearAll();
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return this.storageService.isAuthenticated();
  }

  // Obter usuário atual do storage
  getCurrentUser(): User | null {
    return this.storageService.getUser();
  }

  // Processar resposta de autenticação (salvar tokens)
  private handleAuthResponse(response: AuthResponse): void {
    this.storageService.setAccessToken(response.accessToken);
    this.storageService.setRefreshToken(response.refreshToken);
    this.storageService.setExpiresAt(response.expiresAt);
  }
}