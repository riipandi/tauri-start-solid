import { style } from '@vanilla-extract/css'
import { islandShell } from '#/styles/common.css'
import { vars } from '#/styles/theme.css'

export const aboutSection = style([
  islandShell,
  {
    borderRadius: '1rem',
    padding: '1.5rem',
    '@media': {
      '(min-width: 640px)': {
        padding: '2rem'
      }
    }
  }
])

export const aboutTitle = style({
  fontFamily: "'Fraunces', Georgia, serif",
  marginBottom: '0.75rem',
  fontSize: '2.25rem',
  fontWeight: 'bold',
  color: vars.color.seaInk,
  '@media': {
    '(min-width: 640px)': {
      fontSize: '3rem'
    }
  }
})

export const aboutDescription = style({
  margin: 0,
  maxWidth: '48rem',
  fontSize: '1rem',
  lineHeight: '2',
  color: vars.color.seaInkSoft
})
