import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['@ionic/angular', '@ionic/core'],
    include: ['three', 'three/examples/jsm/controls/OrbitControls', 'dat.gui']
  },
  server: {
    port: 8100,
    host: true,
    middlewareMode: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  preview: {
    port: 8100,
  },
});
