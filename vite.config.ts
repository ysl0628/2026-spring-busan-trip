import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/sheet': {
            target: 'https://script.google.com',
            changeOrigin: true,
            secure: true,
            rewrite: () => '/macros/s/AKfycbxDap_R1NV5Z3FsmjrRmaRjWA0Gw1s4y8mxVrY_dkWTQ-rFqa9GxRFH5zqwFk2thNc_hw/exec'
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
