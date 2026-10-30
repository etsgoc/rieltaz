import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
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
