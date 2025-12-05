import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import localeIt from '@angular/common/locales/it';
import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { AuthService } from './shared/services/auth/auth.service';
import { environment } from '../environment/environment';
import { RefreshTokenService } from './shared/services/auth/refresh-token.service';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { BrowserModule } from '@angular/platform-browser';
import { TokenExpiredInterceptor } from './shared/interceptors/tokenExpired.interceptor';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { cacheInterceptorFn } from './shared/interceptors/cache.interceptor';

registerLocaleData(localeIt);

export function tokenGetter() {
  return localStorage.getItem('encryptedUser'); // o 'encryptedUser', se ci salvi il JWT lì
}

export const IT_DATE_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMMM yyyy',
    dateA11yLabel: 'dd/MM/yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  }
};

export function jwtOptionsFactory(authService: AuthService) {
  return {
    tokenGetter: () => {
      const storedUser = authService.getEncryptedStoredUsed();
      return storedUser?.authentication;
    },
    allowedDomains: environment.jwt.allowedDomain
  };
}

export function appInitializerFactory(refreshTokenService: RefreshTokenService) {
  return () => refreshTokenService.scheduleSilentRefresh();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideNativeDateAdapter(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withPreloading(PreloadAllModules)
    ),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([cacheInterceptorFn])
    ),
    importProvidersFrom(
      BrowserModule,
      JwtModule.forRoot({
        jwtOptionsProvider: {
          provide: JWT_OPTIONS,
          useFactory: (authService: AuthService) => {
            return {
              tokenGetter: () => {
                const storedUser = authService.getEncryptedStoredUsed();
                return storedUser?.authentication;
              },
              allowedDomains: environment.jwt.allowedDomain
            };
          },
          deps: [AuthService]
        }
      })
    ),
    provideAnimationsAsync(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenExpiredInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: (refreshTokenService: RefreshTokenService) => () => refreshTokenService.scheduleSilentRefresh(),
      multi: true,
      deps: [RefreshTokenService]
    },
    provideRouter(routes) // opzionale se usi standalone routing
  ]
};
