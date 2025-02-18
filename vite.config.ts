import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'pathe'
import { env, isCI, isDevelopment } from 'std-env'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tsconfigPaths from 'vite-tsconfig-paths'

const host = env.TAURI_DEV_HOST
const isDev = isDevelopment || process.env.TAURI_ENV_DEBUG

export default defineConfig(async () => ({
  plugins: [solid(), tailwindcss(), tsconfigPaths()],
  // Environment variables starting with the item of `envPrefix`
  // will be exposed in tauri's source code through `import.meta.env`.
  envPrefix: ['VITE_', 'TAURI_ENV_*'],
  publicDir: resolve('assets'),
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host ? { protocol: 'ws', host, port: 1421 } : undefined,
    watch: {
      // Tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target: process.env.TAURI_ENV_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
    manifest: true,
    minify: !isDev,
    sourcemap: !!isDev,
    emptyOutDir: true,
    chunkSizeWarningLimit: 1024,
    reportCompressedSize: false,
    outDir: resolve('.output/client'),
    terserOptions: { format: { comments: false } },
    esbuild: { legalComments: 'inline' },
    rollupOptions: {
      output: {
        // Output with hash in filename
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      },
    },
  },
  test: {
    environment: 'jsdom',
    exclude: ['node_modules', 'tests-e2e'],
    reporters: isCI ? ['html', 'github-actions'] : ['html', 'default'],
    include: ['./tests/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./tests/setup-client.ts'],
    outputFile: {
      json: './tests-results/vitest-results.json',
      html: './tests-results/index.html',
    },
    coverage: {
      provider: 'v8',
      reporter: ['html-spa', 'text-summary'],
      reportsDirectory: './tests-results/coverage',
      cleanOnRerun: true,
      clean: true,
      thresholds: {
        global: {
          statements: 80,
          branches: 70,
          functions: 75,
          lines: 80,
        },
      },
    },
    globals: true,
  },
}))
