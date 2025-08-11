import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@demmarl/schedule-timeline': path.resolve(__dirname, '../dist/index.esm.js')
    }
  },
  optimizeDeps: {
    exclude: ['@demmarl/schedule-timeline']
  }
})
