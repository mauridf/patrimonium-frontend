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

@Component({
  selector: 'app-register',
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
    <div class="register-container">
      <h2 class="register-title">Criar Conta</h2>
      <p class="register-subtitle">Preencha os dados para se registrar</p>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <!-- Campo Nome -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome completo</mat-label>
          <input matInput formControlName="name" placeholder="Seu nome completo">
          <mat-icon matPrefix>person</mat-icon>
          <mat-error *ngIf="registerForm.get('name')?.hasError('required')">
            Nome é obrigatório
          </mat-error>
          <mat-error *ngIf="registerForm.get('name')?.hasError('minlength')">
            Mínimo 3 caracteres
          </mat-error>
        </mat-form-field>

        <!-- Campo Email -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" placeholder="seu@email.com">
          <mat-icon matPrefix>email</mat-icon>
          <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
            Email é obrigatório
          </mat-error>
          <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
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
          <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
            Senha é obrigatória
          </mat-error>
          <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
            Mínimo 8 caracteres
          </mat-error>
          <mat-error *ngIf="registerForm.get('password')?.hasError('pattern')">
            Deve conter: maiúscula, minúscula, número e símbolo
          </mat-error>
        </mat-form-field>

        <!-- Campo Confirmar Senha -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirmar senha</mat-label>
          <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" formControlName="confirmPassword">
          <mat-icon matPrefix>lock</mat-icon>
          <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
            Confirmação é obrigatória
          </mat-error>
          <mat-error *ngIf="registerForm.hasError('passwordsMismatch')">
            Senhas não conferem
          </mat-error>
        </mat-form-field>

        <!-- Loading Bar -->
        <mat-progress-bar *ngIf="loading" mode="indeterminate" class="mb-2"></mat-progress-bar>

        <!-- Botão Registrar -->
        <button mat-raised-button color="primary" type="submit" class="full-width register-button" [disabled]="registerForm.invalid || loading">
          <mat-icon>person_add</mat-icon>
          {{ loading ? 'Criando conta...' : 'Criar Conta' }}
        </button>

        <!-- Link para Login -->
        <div class="login-link">
          <span>Já tem conta?</span>
          <a routerLink="/auth/login">Fazer login</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .register-title {
      font-size: 24px;
      font-weight: 600;
      color: #1a237e;
      margin-bottom: 8px;
    }

    .register-subtitle {
      color: #666;
      margin-bottom: 24px;
      font-size: 14px;
    }

    .register-button {
      padding: 12px;
      font-size: 16px;
      margin-top: 8px;
      height: 48px;

      mat-icon {
        margin-right: 8px;
      }
    }

    .login-link {
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
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validator personalizado: verifica se senhas são iguais
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      return { passwordsMismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const { name, email, password } = this.registerForm.value;

    this.authService.register({ name, email, password }).subscribe({
      next: (user) => {
        this.loading = false;
        this.snackBar.open('Conta criada com sucesso! Faça login.', 'OK', {
          duration: 5000,
          panelClass: 'success-snackbar'
        });
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.loading = false;
        const message = error.error?.message || 'Erro ao criar conta';
        const errors = error.error?.errors;
        
        if (errors && errors.length > 0) {
          this.snackBar.open(errors.join('. '), 'OK', {
            duration: 8000,
            panelClass: 'error-snackbar'
          });
        } else {
          this.snackBar.open(message, 'OK', {
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        }
      }
    });
  }
}