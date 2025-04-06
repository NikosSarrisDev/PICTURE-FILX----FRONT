import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {provideAnimations} from '@angular/platform-browser/animations';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimations() ,provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(), providePrimeNG({
    theme: {
      preset: Aura
    }
  }), importProvidersFrom(YouTubePlayerModule), provideAnimationsAsync()]
};
