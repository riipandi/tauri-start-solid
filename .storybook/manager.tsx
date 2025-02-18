/* @ref: https://storybook.js.org/docs/configure/user-interface/theming/ */
import { addons } from '@storybook/manager-api'
import { themes } from '@storybook/theming'

addons.setConfig({
  theme: themes.dark,
  sidebar: {
    showRoots: false,
    collapsedRoots: ['other'],
  },
  panelPosition: 'right',
  enableShortcuts: false,
  isFullscreen: false,
  showNav: true,
  showPanel: true,
  showToolbar: true,
  toolbar: {
    copy: { hidden: true },
    eject: { hidden: false },
    fullscreen: { hidden: true },
    title: { hidden: false },
    zoom: { hidden: false },
    'storybook/viewport': { hidden: false },
    'storybook/outline': { hidden: false },
  },
  initialActive: 'sidebar',
  selectedPanel: 'controls',
})
