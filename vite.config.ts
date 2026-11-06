import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(() => ({
  // Uses /trading-research-lab/ when built in GitHub Actions; '/' for local development
  base: process.env.GITHUB_ACTIONS || process.env.BASE_URL ? '/trading-research-lab/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
}))
