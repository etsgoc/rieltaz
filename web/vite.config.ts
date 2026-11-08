import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  // Set VITE_BASE=/repo-name/ when hosting on GitHub Pages under a project URL.
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, '../packages/core/src'),
      '@data': path.resolve(__dirname, '../data'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: { fs: { allow: ['..'] } },
});
