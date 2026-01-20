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
            rewrite: () => '/macros/s/AKfycbwwX0F7AqRreLHoCt1qkdI5xyH3wbVow87AQ361M63n0PB_DDhuEiJORtYENhmsVGFk/exec'
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
