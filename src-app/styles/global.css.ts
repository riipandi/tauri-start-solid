import { globalStyle } from '@vanilla-extract/css'
import { vars } from '#/styles/theme.css'

globalStyle('*', {
  boxSizing: 'border-box'
})

globalStyle('html, body, #app', {
  minHeight: '100%'
})

globalStyle('body', {
  margin: 0,
  color: vars.color.seaInk,
  fontFamily: "'Manrope', ui-sans-serif, system-ui, sans-serif",
  backgroundColor: vars.bg.base,
  background: `
    radial-gradient(1100px 620px at -8% -10%, ${vars.gradient.heroA}, transparent 58%),
    radial-gradient(1050px 620px at 112% -12%, ${vars.gradient.heroB}, transparent 62%),
    radial-gradient(720px 380px at 50% 115%, rgba(79, 184, 178, 0.1), transparent 68%),
    linear-gradient(180deg, color-mix(in oklab, ${vars.color.sand} 68%, white) 0%, ${vars.color.foam} 44%, ${vars.bg.base} 100%)
  `,
  overflowX: 'hidden',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale'
})

globalStyle('a', {
  color: vars.color.lagoonDeep,
  textDecorationColor: 'rgba(50, 143, 151, 0.4)',
  textDecorationThickness: '1px',
  textUnderlineOffset: '2px'
})

globalStyle('a:hover', {
  color: '#246f76'
})

globalStyle('code', {
  fontSize: '0.9em',
  border: `1px solid ${vars.color.line}`,
  background: 'color-mix(in oklab, rgba(255, 255, 255, 0.9) 82%, white 18%)',
  borderRadius: '7px',
  padding: '2px 7px'
})
