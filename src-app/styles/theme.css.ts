import { createTheme } from '@vanilla-extract/css'

export const [themeClass, vars] = createTheme({
  color: {
    seaInk: '#173a40',
    seaInkSoft: '#416166',
    lagoon: '#4fb8b2',
    lagoonDeep: '#328f97',
    palm: '#2f6a4a',
    sand: '#e7f0e8',
    foam: '#f3faf5',
    surface: 'rgba(255, 255, 255, 0.74)',
    surfaceStrong: 'rgba(255, 255, 255, 0.9)',
    line: 'rgba(23, 58, 64, 0.14)',
    insetGlint: 'rgba(255, 255, 255, 0.82)',
    kicker: 'rgba(47, 106, 74, 0.9)'
  },
  bg: {
    base: '#e7f3ec',
    header: 'rgba(251, 255, 248, 0.84)',
    chip: 'rgba(255, 255, 255, 0.8)'
  },
  gradient: {
    heroA: 'rgba(79, 184, 178, 0.36)',
    heroB: 'rgba(47, 106, 74, 0.2)'
  }
})
