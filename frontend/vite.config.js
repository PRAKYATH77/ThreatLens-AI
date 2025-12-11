import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Add this proxy block to connect to your backend
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', // Matches your backend server URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
})