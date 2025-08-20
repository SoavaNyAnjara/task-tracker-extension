import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite copie automatiquement tout le dossier "public" vers "dist"
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
