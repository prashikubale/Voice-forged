import { defineConfig } from 'vite';

export default defineConfig({
    base: './', // Makes paths relative for easier deployment/viewing
    server: {
        host: true, // Listen on all addresses
        open: true, // Attempt to open in browser automatically
    }
});
