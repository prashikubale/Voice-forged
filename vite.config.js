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
        host: true, // Listen on all addresses
        open: true, // Attempt to open in browser automatically
    }
});
