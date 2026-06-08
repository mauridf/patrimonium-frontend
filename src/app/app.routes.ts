import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./layout/auth-layout/auth-layout.component')
      .then(m => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./core/auth/login/login.component')
          .then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./core/auth/register/register.component')
          .then(m => m.RegisterComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component')
      .then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'persons',
        loadComponent: () => import('./features/persons/persons')
          .then(m => m.PersonsComponent)
      },
      {
        path: 'properties',
        loadComponent: () => import('./features/properties/properties')
          .then(m => m.PropertiesComponent)
      },
      {
        path: 'contracts',
        loadComponent: () => import('./features/contracts/contracts')
          .then(m => m.ContractsComponent)
      },
      {
        path: 'transactions',
        loadComponent: () => import('./features/transactions/transactions.component')
          .then(m => m.TransactionsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];