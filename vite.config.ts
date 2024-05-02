import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envPrefix: ['VITE_'],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: '~', replacement: resolve(__dirname, 'public') },
    ],
  },
  esbuild: {
    supported: {
      'top-level-await': true, // browsers can handle top-level-await features
    },
  },
  build: {
    target: 'ES2020',
    chunkSizeWarningLimit: 1024,
    reportCompressedSize: false,
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      input: { app: resolve(__dirname, 'index.html') },
      output: {
        // Output with hash in filename
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      },
    },
  },
})
