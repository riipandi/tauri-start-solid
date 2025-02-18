import { type VariantProps, tv } from 'tailwind-variants'

export const buttonStyles = tv({
  base: [
    'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    '[&[data-loading=true]_svg:not(:first-child)]:hidden [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    'select-none active:scale-[0.99]',
  ],
  variants: {
    variant: {
      default: [
        'bg-gradient-to-b from-background to-muted text-foreground',
        'shadow-sm hover:from-muted hover:to-accent active:from-accent active:to-muted',
      ],
      primary: [
        'bg-gradient-to-b from-primary to-primary/90 text-white',
        'shadow-sm hover:from-primary/90 hover:to-primary/80 active:from-primary/80 active:to-primary/90',
      ],
      secondary: [
        'bg-gradient-to-b from-blue-500 to-blue-600 text-white',
        'shadow-sm hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-600',
      ],
      destructive: [
        'bg-gradient-to-b from-destructive to-destructive/90 text-destructive-foreground',
        'shadow-sm hover:from-destructive/90 hover:to-destructive/80 active:from-destructive/80 active:to-destructive/90',
      ],
      outline: [
        'bg-gradient-to-b from-background to-background/95 text-foreground',
        'shadow-xs hover:from-accent/50 hover:to-accent/40 active:from-accent/40 active:to-accent/50',
      ],
      ghost: [
        'text-foreground hover:bg-accent/80 active:bg-accent',
        'dark:text-foreground dark:active:bg-accent/80 dark:hover:bg-accent',
      ],
      link: [
        'h-auto p-0 text-primary underline-offset-4',
        'hover:text-primary/80 hover:underline active:text-primary/70',
      ],
    },
    size: {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-8',
      icon: 'size-9',
    },
    isLoading: {
      true: 'pointer-events-none relative cursor-wait',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: ['default', 'primary', 'secondary', 'destructive', 'outline'],
      className: 'inset-ring inset-ring-ring/10 inset-shadow-sm inset-shadow-white/5',
    },
    {
      isLoading: true,
      className:
        '[&>svg]:-ml-1 [&>svg]:motion-preset-spin [&>svg]:motion-duration-1000 [&>svg]:size-4',
    },
    {
      size: ['icon'],
      isLoading: true,
      className: '[&>svg]:ml-0',
    },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'default',
    isLoading: false,
  },
})

export type ButtonVariants = VariantProps<typeof buttonStyles>
