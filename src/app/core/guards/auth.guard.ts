import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // Permite acesso
  }

  // Salva URL tentada para redirecionar após login
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false; // Bloqueia acesso
};