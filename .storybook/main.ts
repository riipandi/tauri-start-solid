import type { StorybookConfig } from 'storybook-solidjs-vite'
import { mergeConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const config: StorybookConfig = {
  stories: ['./_docs/**/*.mdx', '../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  staticDirs: ['../assets'],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: { backgrounds: false, controls: true, actions: true },
    },
    '@storybook/addon-links',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: 'storybook-solidjs-vite',
    options: {},
  },
  core: {
    disableTelemetry: true, // 👈 Disables telemetry
    enableCrashReports: false, // 👈 Appends the crash reports to the telemetry events
    disableWhatsNewNotifications: true, // 👈 Disables the Whats New notifications
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
