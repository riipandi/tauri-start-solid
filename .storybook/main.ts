import type { StorybookConfig } from 'storybook-solidjs-vite'
import { mergeConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const config: StorybookConfig = {
  stories: ['./_docs/**/*.mdx', '../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: { backgrounds: false, controls: true, actions: true },
    },
    '@storybook/addon-links',
    {
      name: '@storybook/addon-storysource',
      options: {
        sourceLoaderOptions: {
          injectStoryParameters: true,
        },
        loaderOptions: {
          prettierConfig: { printWidth: 80, singleQuote: false },
        },
      },
    },
    '@storybook/addon-a11y',
  ],
  framework: {
    name: 'storybook-solidjs-vite',
    options: {},
  },
  core: {
    disableTelemetry: true, // 👈 Disables telemetry
    enableCrashReports: false, // 👈 Appends the crash reports to the telemetry events
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tsconfigPaths()],
      build: {
        chunkSizeWarningLimit: 1024 * 4,
      },
      optimizeDeps: {
        esbuildOptions: {
          target: 'es2023',
        },
      },
    })
  },
}

export default config
