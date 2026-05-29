import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '@app/core/services/storage.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const token = storageService.getAccessToken();

  // Se tiver token, clona a requisição e adiciona header Authorization
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};