import { style } from '@vanilla-extract/css'
import { vars } from '#/styles/theme.css'

export const appContainer = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden'
})

export const appContent = style({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden'
})

export const pageWrap = style({
  width: 'min(1080px, calc(100% - 2rem))',
  marginInline: 'auto'
})

export const featureCard = style({
  background: `linear-gradient(165deg, color-mix(in oklab, ${vars.color.surfaceStrong} 93%, white 7%), ${vars.color.surface})`,
  boxShadow:
    '0 1px 0 var(--inset-glint) inset, 0 18px 34px rgba(30, 90, 72, 0.1), 0 4px 14px rgba(23, 58, 64, 0.06)'
})

export const islandKicker = style({
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  fontWeight: '700',
  fontSize: '0.69rem',
  color: vars.color.kicker
})

export const riseIn = style({
  animation: 'rise-in 700ms cubic-bezier(0.16, 1, 0.3, 1) both'
})
