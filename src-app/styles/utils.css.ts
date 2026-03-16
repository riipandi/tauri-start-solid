import { style } from '@vanilla-extract/css'

export const selectable = style({
  WebkitUserSelect: 'all',
  MozUserSelect: 'all',
  msUserSelect: 'none',
  userSelect: 'all'
})

export const nonSelectable = style({
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  userSelect: 'none'
})

export const textSelectable = style({
  WebkitUserSelect: 'text',
  MozUserSelect: 'text',
  msUserSelect: 'text',
  userSelect: 'text'
})
