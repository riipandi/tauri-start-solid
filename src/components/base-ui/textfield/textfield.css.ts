import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export const textfieldLabel = cva(
  'font-medium text-sm data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70',
  {
    variants: {
      label: {
        true: 'data-[invalid]:text-destructive',
      },
      error: {
        true: 'text-destructive text-xs',
      },
      description: {
        true: 'font-normal text-muted-foreground',
      },
    },
    defaultVariants: {
      label: true,
    },
  }
)
