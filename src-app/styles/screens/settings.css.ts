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
