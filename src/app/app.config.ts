/* El tutorial cambia provideBrowserGlobalErrorListeners por provideZoneChangeDetection. Como el resto del proyecto se ha hecho con el primero, no lo he cambiado  */
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
/* provideAnimationAsync aparece como deprecado, aunque se puede seguir usando */
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
/* No importamos whenFetch porque en angular22 ya es el backend predeterminado de HttpClient y no hace falta */
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient()
  ]
};
