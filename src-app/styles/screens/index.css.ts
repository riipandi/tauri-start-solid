import { style } from '@vanilla-extract/css'
import { islandShell } from '#/styles/common.css'
import { vars } from '#/styles/theme.css'

export const card = style([
  islandShell,
  {
    borderRadius: '1.5rem',
    padding: '3rem 2rem',
    maxWidth: '500px',
    width: '100%',
    margin: '20vh auto 0'
  }
])

export const title = style({
  fontFamily: "'Fraunces', Georgia, serif",
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: '2rem',
  textAlign: 'center',
  color: vars.color.seaInk
})

export const greetForm = style({
  display: 'flex',
  gap: '0.75rem',
  width: '100%',
  marginBottom: '1.5rem'
})

export const greetInput = style({
  flex: 1,
  padding: '0.875rem 1rem',
  borderRadius: '0.5rem',
  border: `1px solid ${vars.color.line}`,
  background: 'rgba(255, 255, 255, 0.5)',
  fontSize: '1rem',
  color: vars.color.seaInk,
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  selectors: {
    '&:focus': {
      borderColor: vars.color.lagoonDeep,
      boxShadow: `0 0 0 3px rgba(79, 184, 178, 0.1)`
    },
    '&::placeholder': {
      color: vars.color.seaInkSoft
    }
  }
})

export const response = style({
  marginTop: '0',
  marginBottom: '2rem',
  padding: '1rem 1.25rem',
  borderRadius: '0.75rem',
  background: `linear-gradient(165deg, color-mix(in oklab, ${vars.color.surfaceStrong} 93%, white 7%), ${vars.color.surface})`,
  border: `1px solid ${vars.color.line}`,
  fontSize: '1rem',
  lineHeight: '1.5',
  color: vars.color.seaInk,
  textAlign: 'center',
  boxShadow:
    '0 1px 0 var(--inset-glint) inset, 0 18px 34px rgba(30, 90, 72, 0.1), 0 4px 14px rgba(23, 58, 64, 0.06)'
})

export const navButtons = style({
  display: 'flex',
  gap: '0.75rem',
  justifyContent: 'center',
  flexWrap: 'wrap'
})

export const linkWrapper = style({
  textDecoration: 'none'
})
