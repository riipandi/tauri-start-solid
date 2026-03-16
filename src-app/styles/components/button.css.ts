import { style } from '@vanilla-extract/css'
import { sprinkles } from '#/styles/sprinkles.css'
import { vars } from '#/styles/theme.css'

export const base = style([
  sprinkles({
    px: '5',
    fontSize: 'sm',
    fontWeight: 'semibold',
    display: 'inlineFlex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  {
    borderRadius: '999px',
    padding: '0.625rem 1.25rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    selectors: {
      '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed'
      }
    }
  }
])

export const primary = style({
  border: `1px solid rgba(50, 143, 151, 0.3)`,
  background: 'rgba(79, 184, 178, 0.14)',
  color: vars.color.lagoonDeep,
  textDecoration: 'none',
  selectors: {
    '&:hover:not(:disabled)': {
      transform: 'translateY(-0.125rem)',
      background: 'rgba(79, 184, 178, 0.24)'
    },
    '&:active:not(:disabled)': {
      transform: 'translateY(0)'
    }
  }
})

export const secondary = style({
  border: `1px solid rgba(23, 58, 64, 0.2)`,
  background: 'rgba(255, 255, 255, 0.5)',
  color: vars.color.seaInk,
  textDecoration: 'none',
  selectors: {
    '&:hover:not(:disabled)': {
      transform: 'translateY(-0.125rem)',
      borderColor: 'rgba(23, 58, 64, 0.35)'
    },
    '&:active:not(:disabled)': {
      transform: 'translateY(0)'
    }
  }
})
