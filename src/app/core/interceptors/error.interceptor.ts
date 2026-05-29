import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '@app/core/services/auth.service';
import { StorageService } from '@app/core/services/storage.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const storageService = inject(StorageService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Se for erro 401 (não autorizado) e não for a própria rota de refresh
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        
        // Tentar renovar o token
        const refreshToken = storageService.getRefreshToken();
        
        if (refreshToken) {
          // Tenta refresh e repete a requisição original
          return authService.refreshToken().pipe(
            switchMap(() => {
              // Após refresh bem-sucedido, repete a requisição original
              // com o novo token (o JWT interceptor vai adicionar)
              return next(req);
            }),
            catchError((refreshError) => {
              // Se refresh falhar, faz logout e redireciona
              authService.logout();
              router.navigate(['/auth/login']);
              return throwError(() => refreshError);
            })
          );
        } else {
          // Sem refresh token, faz logout direto
          authService.logout();
          router.navigate(['/auth/login']);
          return throwError(() => error);
        }
      }

      // Para outros erros, apenas repassa
      return throwError(() => error);
    })
  );
};