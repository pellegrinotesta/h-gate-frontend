import { Provider, EnvironmentProviders } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { provideNativeDateAdapter } from '@angular/material/core';

/**
 * Provider comuni per gli unit test: HTTP finto (nessuna chiamata reale), router vuoto,
 * dialog finti e animazioni disattivate.
 */
export const TEST_PROVIDERS: (Provider | EnvironmentProviders)[] = [
  provideHttpClient(),
  provideHttpClientTesting(),
  provideRouter([]),
  provideNoopAnimations(),
  provideNativeDateAdapter(),
  { provide: MatDialogRef, useValue: { close: () => undefined, afterClosed: () => ({ subscribe: () => undefined }) } },
  { provide: MAT_DIALOG_DATA, useValue: {} },
  { provide: JwtHelperService, useValue: new JwtHelperService() }
];
