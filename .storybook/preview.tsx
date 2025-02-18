import type { Preview } from 'storybook-solidjs'
import { withThemeProvider } from './components/decorators'
import { Link } from './components/link'
import { light } from './themes'

// Import the global Tailwind CSS styles
import '../src/styles/global.css'
import '../src/styles/colors.css'
import '../src/styles/scrollbar.css'

const preview: Preview = {
  // Optional parameter to center the component in the Canvas.
  // More info: https://storybook.js.org/docs/configure/story-layout
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    previewTabs: { 'storybook/docs/panel': { index: -1 } },
    controls: {
      expanded: true,
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      exclude: ['asChild', 'onClick'],
    },
    viewport: {
      viewports: {
        smallMobile: {
          name: 'Small mobile',
          styles: { width: '320px', height: '568px' },
        },
        largeMobile: {
          name: 'Large mobile',
          styles: { width: '414px', height: '896px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '834px', height: '1112px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '1000px' },
        },
      },
    },
    options: {
      // https://storybook.js.org/docs/writing-stories/naming-components-and-hierarchy
      storySort: {
        method: 'alphabetical',
        includeName: true,
        order: [
          'Introduction',
          'Getting Started',
          'Changelog',
          'Basic Components',
          'Layout Components',
          'Visualizations',
          '*',
        ],
      },
    },
    backgrounds: { disable: true },
    layout: 'padded',
    chromatic: {
      modes: {
        dark: { theme: 'dark' },
        light: { theme: 'light' },
      },
    },
    docs: {
      theme: light,
      components: {
        a: Link,
      },
      // container: DocsContainer,
      defaultName: 'Documentation',
      toc: {
        /* Enables the table of contents */
        headingSelector: 'h2, h3',
        ignoreSelector: '#preview',
        title: 'Table of Contents',
        disable: false,
        unsafeTocbotOptions: {
          orderedList: false,
        },
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Color Scheme',
      description: 'Global theme for components',
      defaultValue: 'system',
      toolbar: {
        title: 'Color Scheme',
        icon: 'paintbrush',
        dynamicTitle: false,
        showName: false,
        items: [
          { title: 'Match system', value: 'system', icon: 'mirror' },
          { title: 'Light Mode', value: 'light', icon: 'circlehollow' },
          { title: 'Dark Mode', value: 'dark', icon: 'circle' },
        ],
      },
    },
  },
  decorators: [withThemeProvider],
}

export default preview
