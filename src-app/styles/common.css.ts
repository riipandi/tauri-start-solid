import { style } from '@vanilla-extract/css'
import { vars } from '#/styles/theme.css'

export const islandShell = style({
  border: `1px solid ${vars.color.line}`,
  background: `linear-gradient(165deg, ${vars.color.surfaceStrong}, ${vars.color.surface})`,
  boxShadow:
    '0 1px 0 var(--inset-glint) inset, 0 22px 44px rgba(30, 90, 72, 0.1), 0 6px 18px rgba(23, 58, 64, 0.08)',
  backdropFilter: 'blur(4px)'
})
