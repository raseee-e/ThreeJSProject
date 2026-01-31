/**
 * Main Entry Point - Angular Bootstrap
 */

// Import compiler for JIT compilation
import '@angular/compiler';

import './polyfills.ts';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
