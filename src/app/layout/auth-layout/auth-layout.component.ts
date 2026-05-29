import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>🏠 Patrimonium</h1>
          <p>Sistema de Gestão Patrimonial</p>
        </div>
        <div class="auth-content">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%);
      padding: 20px;
    }

    .auth-card {
      width: 100%;
      max-width: 450px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }

    .auth-header {
      background: linear-gradient(135deg, #1a237e, #3949ab);
      color: white;
      padding: 32px 24px;
      text-align: center;

      h1 {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 8px;
      }

      p {
        font-size: 14px;
        opacity: 0.9;
        margin: 0;
      }
    }

    .auth-content {
      padding: 32px 24px;
    }

    @media (max-width: 480px) {
      .auth-card {
        max-width: 100%;
      }

      .auth-header {
        padding: 24px 16px;

        h1 {
          font-size: 24px;
        }
      }

      .auth-content {
        padding: 24px 16px;
      }
    }
  `]
})
export class AuthLayoutComponent {}