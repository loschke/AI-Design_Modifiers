import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true, // Needed for container environment
        strictPort: true
    },
    preview: {
        host: true, // Needed for container environment
        strictPort: true
    }
});
