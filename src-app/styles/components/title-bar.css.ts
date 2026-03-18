import type { StyleRule, GlobalStyleRule } from '@vanilla-extract/css'
import { globalStyle, style } from '@vanilla-extract/css'
import { sprinkles } from '#/styles/sprinkles.css'
import { vars } from '#/styles/theme.css'

export interface DragRegionStyleRule extends StyleRule {
  appRegion?: 'drag' | 'no-drag' | 'none'
  WebkitAppRegion?: 'drag' | 'no-drag' | 'none'
}

export interface DragRegionGlobalStyleRule extends GlobalStyleRule {
  appRegion?: 'drag' | 'no-drag' | 'none'
  WebkitAppRegion?: 'drag' | 'no-drag' | 'none'
}

export const titleBar = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'between',
    width: 'full',
    position: 'relative',
    zIndex: '50',
    userSelect: 'none',
    flexShrink: '0'
  }),
  {
    height: '38px',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${vars.color.line}`,
    appRegion: 'drag',
    selectors: {
      '[data-platform="macos"]&': {
        WebkitAppRegion: 'drag'
      }
    }
  } as DragRegionStyleRule
])

export const leftSection = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    flexShrink: '0'
  }),
  {
    appRegion: 'drag',
    selectors: {
      '[data-platform="macos"] &': {
        width: '80px'
      },
      '[data-platform="windows"] &': {
        paddingLeft: '12px'
      },
      '[data-platform="linux"] &': {
        paddingLeft: '12px'
      }
    }
  } as DragRegionStyleRule
])

export const centerSection = style({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  pointerEvents: 'none',
  appRegion: 'drag',
  WebkitAppRegion: 'drag'
} as DragRegionStyleRule)

export const appTitle = style([
  sprinkles({
    fontSize: 'sm',
    fontWeight: 'medium'
  }),
  {
    color: vars.color.seaInk,
    opacity: 0.9,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
])

export const controls = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center'
  }),
  {
    height: '100%',
    paddingRight: '8px',
    paddingLeft: '8px',
    gap: '2px',
    appRegion: 'no-drag',
    WebkitAppRegion: 'no-drag'
  } as DragRegionStyleRule
])

export const controlButton = style([
  sprinkles({
    display: 'inlineFlex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  {
    width: '46px',
    height: '100%',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
    color: vars.color.seaInk,
    appRegion: 'no-drag',
    selectors: {
      '&:hover': {
        background: 'rgba(23, 58, 64, 0.08)'
      },
      '&:active': {
        background: 'rgba(23, 58, 64, 0.12)'
      },
      '&[data-close]:hover': {
        background: '#e81123'
      }
    }
  } as DragRegionStyleRule
])

globalStyle(`${controlButton} svg`, {
  transition: 'stroke 0.15s ease'
})

globalStyle(`${controlButton}[data-close]:hover svg`, {
  stroke: 'white'
})

globalStyle('[data-tauri-drag-region]', {
  appRegion: 'drag',
  WebkitAppRegion: 'drag'
} as DragRegionGlobalStyleRule)

globalStyle('[data-tauri-drag-region] *', {
  WebkitAppRegion: 'drag'
} as DragRegionGlobalStyleRule)
