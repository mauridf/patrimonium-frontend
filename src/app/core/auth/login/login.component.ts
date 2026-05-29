import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '@app/core/services/auth.service';
import { StorageService } from '@app/core/services/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <h2 class="login-title">Entrar</h2>
      <p class="login-subtitle">Acesse sua conta para continuar</p>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <!-- Campo Email -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" placeholder="seu@email.com">
          <mat-icon matPrefix>email</mat-icon>
          <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
            Email é obrigatório
          </mat-error>
          <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
            Email inválido
          </mat-error>
        </mat-form-field>

        <!-- Campo Senha -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Senha</mat-label>
          <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
          <mat-icon matPrefix>lock</mat-icon>
          <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
            <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
          <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
            Senha é obrigatória
          </mat-error>
        </mat-form-field>

        <!-- Loading Bar -->
        <mat-progress-bar *ngIf="loading" mode="indeterminate" class="mb-2"></mat-progress-bar>

        <!-- Botão Entrar -->
        <button mat-raised-button color="primary" type="submit" class="full-width login-button" [disabled]="loginForm.invalid || loading">
          <mat-icon>login</mat-icon>
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <!-- Link para Registro -->
        <div class="register-link">
          <span>Não tem conta?</span>
          <a routerLink="/auth/register">Criar conta</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .login-title {
      font-size: 24px;
      font-weight: 600;
      color: #1a237e;
      margin-bottom: 8px;
    }

    .login-subtitle {
      color: #666;
      margin-bottom: 24px;
      font-size: 14px;
    }

    .login-button {
      padding: 12px;
      font-size: 16px;
      margin-top: 8px;
      height: 48px;

      mat-icon {
        margin-right: 8px;
      }
    }

    .register-link {
      text-align: center;
      margin-top: 24px;
      font-size: 14px;
      color: #666;

      a {
        color: #1a237e;
        text-decoration: none;
        font-weight: 500;
        margin-left: 4px;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    mat-form-field {
      margin-bottom: 4px;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        // Buscar dados do usuário após login
        this.authService.getProfile().subscribe({
          next: (user) => {
            this.storageService.setUser(user);
            this.loading = false;
            this.snackBar.open(`Bem-vindo, ${user.name}!`, 'OK', {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.loading = false;
          }
        });
      },
      error: (error) => {
        this.loading = false;
        const message = error.error?.message || 'Erro ao fazer login';
        this.snackBar.open(message, 'OK', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }
}