import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
    include: [
      'src/test/**/*.test.jsx', 
      'src/test/**/*.fixed.test.jsx',
      'src/test/ProtectedRoute.test.jsx'
    ],
  },
})
