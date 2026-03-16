import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import process from 'node:process'
import { resolve } from 'pathe'
import solidDevTools from 'solid-devtools/vite'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

const isProduction = process.env.NODE_ENV === 'production'
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
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**']
    }
  },
  build: {
    chunkSizeWarningLimit: 1024 * 2,
    minify: isProduction ? 'oxc' : false
  }
})
