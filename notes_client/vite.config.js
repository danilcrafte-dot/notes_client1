import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Запити /api проксуються на серверну частину (notes-api), тому CORS у розробці не заважає.
// Якщо сервер працює на іншому порту - змініть target.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': { target: 'http://localhost:3000', changeOrigin: true } },
  },
});
