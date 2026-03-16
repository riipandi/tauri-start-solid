import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

const space = {
  '0': '0',
  '0.5': '0.125rem',
  '1': '0.25rem',
  '2': '0.5rem',
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '8': '2rem',
  '10': '2.5rem',
  '12': '3rem',
  '14': '3.5rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem'
}

const responsiveProperties = defineProperties({
  properties: {
    display: {
      flex: 'flex',
      grid: 'grid',
      block: 'block',
      inlineFlex: 'inline-flex'
    },
    flexDirection: {
      row: 'row',
      column: 'column'
    },
    flexWrap: {
      wrap: 'wrap',
      nowrap: 'nowrap'
    },
    alignItems: {
      center: 'center',
      start: 'flex-start',
      end: 'flex-end'
    },
    justifyContent: {
      center: 'center',
      between: 'space-between'
    },
    flexShrink: {
      '0': '0',
      '1': '1'
    },
    padding: space,
    paddingTop: space,
    paddingBottom: space,
    paddingLeft: space,
    paddingRight: space,
    margin: space,
    marginTop: space,
    marginBottom: space,
    marginLeft: space,
    marginRight: space,
    gap: space,
    width: {
      full: '100%',
      auto: 'auto'
    },
    maxWidth: {
      '2xl': '42rem',
      '3xl': '48rem'
    },
    fontSize: {
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.02',
      normal: '1.5',
      relaxed: '2'
    },
    letterSpacing: {
      tight: '-0.025em'
    },
    textAlign: {
      left: 'left',
      center: 'center'
    },
    position: {
      relative: 'relative',
      absolute: 'absolute',
      sticky: 'sticky'
    },
    top: space,
    left: space,
    right: space,
    bottom: space,
    overflow: {
      hidden: 'hidden'
    },
    zIndex: {
      '10': '10',
      '50': '50'
    },
    userSelect: {
      none: 'none',
      text: 'text',
      all: 'all',
      auto: 'auto'
    }
  },
  shorthands: {
    p: ['padding'],
    pt: ['paddingTop'],
    pb: ['paddingBottom'],
    px: ['paddingLeft', 'paddingRight'],
    py: ['paddingTop', 'paddingBottom'],
    m: ['margin'],
    mt: ['marginTop'],
    mb: ['marginBottom'],
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom']
  }
})

export const sprinkles = createSprinkles(responsiveProperties)
