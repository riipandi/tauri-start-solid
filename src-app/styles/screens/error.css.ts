import { style } from '@vanilla-extract/css'
import { islandShell } from '#/styles/common.css'
import { sprinkles } from '#/styles/sprinkles.css'
import { vars } from '#/styles/theme.css'

export const errorContainer = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  {
    minHeight: '100vh'
  }
])

export const errorCard = style([
  islandShell,
  sprinkles({
    px: '8',
    py: '10',
    textAlign: 'center'
  }),
  {
    borderRadius: '1rem',
    maxWidth: '28rem'
  }
])

export const errorCode = style({
  fontSize: '6rem',
  fontWeight: 'bold',
  lineHeight: '1',
  marginBottom: '1rem',
  background: `linear-gradient(135deg, ${vars.color.lagoonDeep}, ${vars.color.palm})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
})

export const errorTitle = style({
  fontFamily: "'Fraunces', Georgia, serif",
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '0.75rem',
  color: vars.color.seaInk
})

export const errorDescription = style({
  fontSize: '1rem',
  lineHeight: '1.5',
  color: vars.color.seaInkSoft,
  marginBottom: '2rem'
})

export const homeButton = style({
  borderRadius: '999px',
  border: `1px solid rgba(23, 58, 64, 0.2)`,
  background: 'rgba(255, 255, 255, 0.5)',
  padding: '0.625rem 1.25rem',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: vars.color.seaInk,
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  display: 'inline-block',
  selectors: {
    '&:hover': {
      transform: 'translateY(-0.125rem)',
      borderColor: 'rgba(23, 58, 64, 0.35)'
    }
  }
})
