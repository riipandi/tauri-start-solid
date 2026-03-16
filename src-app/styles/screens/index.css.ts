import { style } from '@vanilla-extract/css'
import { islandShell } from '#/styles/common.css'
import { sprinkles } from '#/styles/sprinkles.css'
import { vars } from '#/styles/theme.css'

export const heroSection = style([
  islandShell,
  sprinkles({
    position: 'relative',
    overflow: 'hidden'
  }),
  {
    borderRadius: '2rem',
    padding: '2.5rem 1.5rem',
    '@media': {
      '(min-width: 640px)': {
        padding: '3.5rem 2.5rem'
      }
    }
  }
])

export const heroGradientA = style({
  pointerEvents: 'none',
  position: 'absolute',
  left: '-5rem',
  top: '-6rem',
  height: '14rem',
  width: '14rem',
  borderRadius: '999px',
  background: 'radial-gradient(circle, rgba(79, 184, 178, 0.32), transparent 66%)'
})

export const heroGradientB = style({
  pointerEvents: 'none',
  position: 'absolute',
  right: '-5rem',
  bottom: '-5rem',
  height: '14rem',
  width: '14rem',
  borderRadius: '999px',
  background: 'radial-gradient(circle, rgba(47, 106, 74, 0.18), transparent 66%)'
})

export const heroTitle = style({
  fontFamily: "'Fraunces', Georgia, serif",
  marginBottom: '1.25rem',
  maxWidth: '48rem',
  fontSize: '2.25rem',
  lineHeight: '1.02',
  fontWeight: 'bold',
  letterSpacing: '-0.025em',
  color: vars.color.seaInk,
  '@media': {
    '(min-width: 640px)': {
      fontSize: '3.75rem'
    }
  }
})

export const heroDescription = style({
  marginBottom: '2rem',
  maxWidth: '42rem',
  fontSize: '1rem',
  color: vars.color.seaInkSoft,
  '@media': {
    '(min-width: 640px)': {
      fontSize: '1.125rem'
    }
  }
})

export const buttonGroup = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem'
})

export const primaryButton = style({
  borderRadius: '999px',
  border: '1px solid rgba(50, 143, 151, 0.3)',
  background: 'rgba(79, 184, 178, 0.14)',
  padding: '0.625rem 1.25rem',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: vars.color.lagoonDeep,
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  selectors: {
    '&:hover': {
      transform: 'translateY(-0.125rem)',
      background: 'rgba(79, 184, 178, 0.24)'
    }
  }
})

export const secondaryButton = style({
  borderRadius: '999px',
  border: '1px solid rgba(23, 58, 64, 0.2)',
  background: 'rgba(255, 255, 255, 0.5)',
  padding: '0.625rem 1.25rem',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: vars.color.seaInk,
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  selectors: {
    '&:hover': {
      transform: 'translateY(-0.125rem)',
      borderColor: 'rgba(23, 58, 64, 0.35)'
    }
  }
})

export const featuresGrid = style({
  display: 'grid',
  gap: '1rem',
  marginTop: '2rem',
  '@media': {
    '(min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, 1fr)'
    },
    '(min-width: 1024px)': {
      gridTemplateColumns: 'repeat(4, 1fr)'
    }
  }
})

export const featureItem = style([
  islandShell,
  {
    borderRadius: '1rem',
    padding: '1.25rem'
  }
])

export const featureTitle = style({
  marginBottom: '0.5rem',
  fontSize: '1rem',
  fontWeight: '600',
  color: vars.color.seaInk
})

export const featureDescription = style({
  margin: 0,
  fontSize: '0.875rem',
  color: vars.color.seaInkSoft
})
