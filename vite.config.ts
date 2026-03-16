import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import process from 'node:process'
import { resolve } from 'pathe'
import solidDevTools from 'solid-devtools/vite'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

const isProduction = process.env.NODE_ENV === 'production' || !process.env.TAURI_ENV_DEBUG
const host = process.env.TAURI_DEV_HOST

export default defineConfig({
  plugins: [
    solidDevTools(),
    vanillaExtractPlugin(),
    tanstackRouter({
      routesDirectory: resolve('./src-app/routes'),
      generatedRouteTree: resolve('./src-app/routes.gen.ts'),
      autoCodeSplitting: true,
      target: 'solid'
    }),
    solidPlugin()
  ],
  // Environment variables starting with the item of `envPrefix`
  // will be exposed in tauri's source code through `import.meta.env`.
  envPrefix: ['VITE_', 'TAURI_ENV_*'],
  publicDir: resolve('assets'),
  resolve: {
    alias: {
      '#': resolve('./src-app'),
      '~': resolve('./')
    },
    tsconfigPaths: true
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host ? { protocol: 'ws', host, port: 1421 } : undefined,
    watch: { ignored: ['**/src-tauri/**', '**/dist/**', '**/.output/**'] }
  },
  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target: process.env.TAURI_ENV_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
    minify: isProduction ? 'oxc' : false,
    chunkSizeWarningLimit: 1024 * 2,
    emptyOutDir: true,
    manifest: true,
    outDir: resolve('.output/frontend'),
    rolldownOptions: {
      input: resolve('index.html'),
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash][extname]`,
        chunkFileNames: `assets/[name]-[hash].js`
      }
    }
  }
})
