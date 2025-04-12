import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: true,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1600,

    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name.split('.').pop();
          if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext)) {
            return 'assets/img/[name]-[hash][extname]';
          }
          if (ext === 'css') {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[ext]/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',

        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['axios', 'lodash']
          // Eliminada la referencia a main.css que causaba el error
        }
      }
    }
  },
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase'
    }
  },
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets',
      '@img': '/src/assets/img'
    }
  },
  server: {
    port: 3000,
    host: true
  }
});