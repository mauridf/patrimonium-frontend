import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '@app/core/services/auth.service';
import { StorageService } from '@app/core/services/storage.service';
import { User } from '@app/core/models';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <!-- Sidebar -->
      <mat-sidenav #drawer class="sidenav" fixedInViewport [mode]="'side'" [opened]="true">
        <div class="sidenav-header">
          <div class="logo-section">
            <mat-icon class="logo-icon">account_balance</mat-icon>
            <span class="logo-text">Patrimonium</span>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Navegação -->
        <mat-nav-list>
          <a *ngFor="let item of navItems" 
             mat-list-item 
             [routerLink]="item.route"
             routerLinkActive="active-link"
             [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }">
            <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
            <span matListItemTitle>{{ item.label }}</span>
          </a>
        </mat-nav-list>

        <div class="sidenav-footer">
          <mat-divider></mat-divider>
          <div class="user-info" *ngIf="currentUser">
            <mat-icon>account_circle</mat-icon>
            <div class="user-details">
              <span class="user-name">{{ currentUser.name }}</span>
              <span class="user-email">{{ currentUser.email }}</span>
            </div>
          </div>
        </div>
      </mat-sidenav>

      <!-- Conteúdo Principal -->
      <mat-sidenav-content>
        <!-- Toolbar -->
        <mat-toolbar color="primary" class="toolbar">
          <button mat-icon-button (click)="drawer.toggle()" class="menu-button">
            <mat-icon>menu</mat-icon>
          </button>
          
          <span class="toolbar-title">Patrimonium</span>
          
          <span class="spacer"></span>

          <!-- Menu do Usuário -->
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
          
          <mat-menu #userMenu="matMenu">
            <div class="menu-header" *ngIf="currentUser">
              <span class="menu-user-name">{{ currentUser.name }}</span>
              <span class="menu-user-email">{{ currentUser.email }}</span>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/profile">
              <mat-icon>person</mat-icon>
              <span>Meu Perfil</span>
            </button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Sair</span>
            </button>
          </mat-menu>
        </mat-toolbar>

        <!-- Área de Conteúdo -->
        <div class="content">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      background-color: #f5f5f5;
    }

    .sidenav {
      width: 260px;
      background: white;
      border-right: 1px solid #e0e0e0;
    }

    .sidenav-header {
      padding: 24px 16px 16px;
      background: linear-gradient(135deg, #1a237e, #3949ab);
      color: white;

      .logo-section {
        display: flex;
        align-items: center;
        gap: 12px;

        .logo-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
        }

        .logo-text {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
      }
    }

    mat-nav-list {
      padding: 8px;

      a {
        border-radius: 8px;
        margin-bottom: 4px;
        color: #555;
        transition: all 0.2s ease;

        mat-icon {
          color: #666;
        }

        &:hover {
          background-color: #f0f0f0;
        }

        &.active-link {
          background-color: #e8eaf6;
          color: #1a237e;

          mat-icon {
            color: #1a237e;
          }
        }
      }
    }

    .sidenav-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      background: white;

      .user-info {
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;

        .user-details {
          display: flex;
          flex-direction: column;

          .user-name {
            font-size: 14px;
            font-weight: 500;
            color: #333;
          }

          .user-email {
            font-size: 12px;
            color: #999;
          }
        }
      }
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .toolbar-title {
        font-size: 18px;
        font-weight: 500;
        margin-left: 8px;
      }
    }

    .spacer {
      flex: 1 1 auto;
    }

    .menu-header {
      padding: 16px;
      display: flex;
      flex-direction: column;
      min-width: 200px;

      .menu-user-name {
        font-weight: 500;
        font-size: 14px;
      }

      .menu-user-email {
        font-size: 12px;
        color: #999;
        margin-top: 4px;
      }
    }

    .content {
      padding: 24px;
      min-height: calc(100vh - 64px);
    }

    @media (max-width: 768px) {
      .sidenav {
        width: 100%;
      }

      .content {
        padding: 16px;
      }
    }
  `]
})
export class MainLayoutComponent {
  currentUser: User | null = null;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Pessoas', icon: 'people', route: '/persons' },
    { label: 'Propriedades', icon: 'home', route: '/properties' },
    { label: 'Contratos', icon: 'description', route: '/contracts' },
    { label: 'Transações', icon: 'attach_money', route: '/transactions' },
  ];

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {
    this.currentUser = this.storageService.getUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}