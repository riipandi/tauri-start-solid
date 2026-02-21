import type { StorybookConfig } from 'storybook-solidjs-vite'
import { mergeConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const config: StorybookConfig = {
  stories: ['./_docs/**/*.mdx', '../src-app/**/*.mdx', '../src-app/**/*.stories.@(ts|tsx)'],
  staticDirs: ['../assets'],
  addons: ['@storybook/addon-links', '@storybook/addon-a11y', '@storybook/addon-docs'],

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

  features: {
    backgrounds: false,
    controls: true,
    actions: true,
  },
}

export default config
