import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['common'],
  },
  build: {
    commonjsOptions: {
      include: [/common/, /node_modules/],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/jest.setup.js",
    include: ["src/**/*.test.js", "src/**/*.test.jsx"],
    exclude: ["src/main.jsx"],
  },
})