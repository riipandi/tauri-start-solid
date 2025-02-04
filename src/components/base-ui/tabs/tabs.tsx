import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import type {
  TabsContentProps,
  TabsIndicatorProps,
  TabsListProps,
  TabsRootProps,
  TabsTriggerProps,
} from '@kobalte/core/tabs'
import { Tabs as TabsPrimitive } from '@kobalte/core/tabs'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { ValidComponent, VoidProps } from 'solid-js'
import { splitProps } from 'solid-js'
import { clx } from '#/libs/utils'

type tabsProps<T extends ValidComponent = 'div'> = TabsRootProps<T> & {
  class?: string
}

export const Tabs = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, tabsProps<T>>
) => {
  const [local, rest] = splitProps(props as tabsProps, ['class'])

  return (
    <TabsPrimitive class={clx('w-full data-[orientation=vertical]:flex', local.class)} {...rest} />
  )
}

type tabsListProps<T extends ValidComponent = 'div'> = TabsListProps<T> & {
  class?: string
}

export const TabsList = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, tabsListProps<T>>
) => {
  const [local, rest] = splitProps(props as tabsListProps, ['class'])

  return (
    <TabsPrimitive.List
      class={clx(
        'relative flex w-full rounded-lg bg-muted p-1 text-muted-foreground data-[orientation=vertical]:flex-col data-[orientation=horizontal]:items-center data-[orientation=vertical]:items-stretch',
        local.class
      )}
      {...rest}
    />
  )
}

type tabsContentProps<T extends ValidComponent = 'div'> = TabsContentProps<T> & {
  class?: string
}

export const TabsContent = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, tabsContentProps<T>>
) => {
  const [local, rest] = splitProps(props as tabsContentProps, ['class'])

  return (
    <TabsPrimitive.Content
      class={clx(
        'transition-shadow duration-200 focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[orientation=horizontal]:mt-2 data-[orientation=vertical]:ml-2',
        local.class
      )}
      {...rest}
    />
  )
}

type tabsTriggerProps<T extends ValidComponent = 'button'> = TabsTriggerProps<T> & {
  class?: string
}

export const TabsTrigger = <T extends ValidComponent = 'button'>(
  props: PolymorphicProps<T, tabsTriggerProps<T>>
) => {
  const [local, rest] = splitProps(props as tabsTriggerProps, ['class'])

  return (
    <TabsPrimitive.Trigger
      class={clx(
        'peer relative z-10 inline-flex h-7 w-full items-center justify-center whitespace-nowrap rounded-md px-3 py-1 font-medium text-sm outline-none transition-colors disabled:pointer-events-none disabled:opacity-50 data-[selected]:text-foreground',
        local.class
      )}
      {...rest}
    />
  )
}

const tabsIndicatorVariants = cva('absolute outline-none transition-all duration-200', {
  variants: {
    variant: {
      block:
        'rounded-md bg-background shadow peer-focus-visible:outline-none peer-focus-visible:ring-[1.5px] peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background data-[orientation=vertical]:top-0 data-[orientation=vertical]:right-1 data-[orientation=horizontal]:bottom-1 data-[orientation=horizontal]:left-0 data-[orientation=horizontal]:h-[calc(100%-0.5rem)] data-[orientation=vertical]:w-[calc(100%-0.5rem)]',
      underline:
        'data-[orientation=horizontal]:-bottom-[1px] data-[orientation=vertical]:-right-[1px] bg-primary data-[orientation=vertical]:top-0 data-[orientation=horizontal]:left-0 data-[orientation=horizontal]:h-[2px] data-[orientation=vertical]:w-[2px]',
    },
  },
  defaultVariants: {
    variant: 'block',
  },
})

type tabsIndicatorProps<T extends ValidComponent = 'div'> = VoidProps<
  TabsIndicatorProps<T> &
    VariantProps<typeof tabsIndicatorVariants> & {
      class?: string
    }
>

export const TabsIndicator = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, tabsIndicatorProps<T>>
) => {
  const [local, rest] = splitProps(props as tabsIndicatorProps, ['class', 'variant'])

  return (
    <TabsPrimitive.Indicator
      class={clx(tabsIndicatorVariants({ variant: local.variant }), local.class)}
      {...rest}
    />
  )
}
