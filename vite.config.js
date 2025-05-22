import { defineConfig, resolveConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'


// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['lucide-react'],
  },
  base: '/Ureno_webdesign/',
  plugins: [
    react()
    ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    }
  },

  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
