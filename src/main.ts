/**
 * Main Entry Point - Angular Bootstrap
 */

// Import compiler for JIT compilation
import '@angular/compiler';

import './polyfills.ts';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule, { ngZone: 'zone.js' })
  .catch(err => {
    console.error('Bootstrap Error:', err);
    throw err;
  });
