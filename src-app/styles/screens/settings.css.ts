import { style } from '@vanilla-extract/css'
import { vars } from '#/styles/theme.css'

export const placeholder = style({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.seaInkSoft,
  fontSize: '1rem'
})

export const container = style({
  maxWidth: '800px',
  margin: '0 auto',
  padding: '2rem'
})

export const header = style({
  marginBottom: '3rem'
})

export const subtitle = style({
  color: vars.color.seaInkSoft,
  marginTop: '0.5rem',
  fontSize: '0.875rem'
})

export const message = style({
  padding: '1rem',
  borderRadius: '0.5rem',
  marginBottom: '2rem',
  fontSize: '0.875rem'
})

export const success = style({
  backgroundColor: '#10b981',
  color: 'white'
})

export const error = style({
  backgroundColor: '#ef4444',
  color: 'white'
})

export const section = style({
  marginBottom: '3rem'
})

export const sectionTitle = style({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '1.5rem',
  color: vars.color.seaInk
})

export const field = style({
  marginBottom: '1.5rem'
})

export const label = style({
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: '500',
  fontSize: '0.875rem'
})

export const select = style({
  width: '100%',
  padding: '0.75rem',
  borderRadius: '0.375rem',
  border: `1px solid ${vars.color.seaInkSoft}`,
  backgroundColor: 'white',
  marginTop: '0.5rem',
  fontSize: '0.875rem'
})

export const input = style({
  width: '100%',
  padding: '0.75rem',
  borderRadius: '0.375rem',
  border: `1px solid ${vars.color.seaInkSoft}`,
  backgroundColor: 'white',
  marginTop: '0.5rem',
  fontSize: '0.875rem'
})

export const help = style({
  fontSize: '0.75rem',
  color: vars.color.seaInkSoft,
  marginTop: '0.5rem'
})

export const checkboxLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  cursor: 'pointer',
  fontSize: '0.875rem'
})

export const resetButton = style({
  padding: '0.75rem 1.5rem',
  backgroundColor: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  fontWeight: '500',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#dc2626'
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
})

export const savingIndicator = style({
  position: 'fixed',
  bottom: '2rem',
  right: '2rem',
  padding: '1rem 2rem',
  backgroundColor: vars.color.seaInk,
  color: 'white',
  borderRadius: '0.5rem',
  fontSize: '0.875rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
})
