import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    base: './', // Makes paths relative for easier deployment/viewing
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                dashboard: resolve(__dirname, 'dashboard.html'),
            }
        }
    },
    server: {
        host: true,
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false,
            },
        },
    }
});
