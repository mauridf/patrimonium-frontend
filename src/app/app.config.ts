import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideEnvironmentNgxMask } from 'ngx-mask';

import { routes } from './app.routes';
import { jwtInterceptor, errorInterceptor } from '@app/core/interceptors';
import { AuthService, StorageService } from './core/services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        jwtInterceptor,   // Adiciona token JWT
        errorInterceptor,  // Trata erros 401
      ])
    ),
    provideEnvironmentNgxMask(), // Máscaras para inputs
    AuthService,
    StorageService,
  ],
};