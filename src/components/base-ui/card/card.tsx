import type { ComponentProps, ParentComponent } from 'solid-js'
import { splitProps } from 'solid-js'
import { clx } from '#/libs/utils'

export const Card = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <div
      class={clx('rounded-lg border bg-card text-card-foreground shadow', local.class)}
      {...rest}
    />
  )
}

export const CardHeader = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class'])

  return <div class={clx('flex flex-col space-y-1.5 p-6', local.class)} {...rest} />
}

export const CardTitle: ParentComponent<ComponentProps<'h1'>> = (props) => {
  const [local, rest] = splitProps(props, ['class'])

  return <h1 class={clx('font-semibold leading-none tracking-tight', local.class)} {...rest} />
}

export const CardDescription: ParentComponent<ComponentProps<'h3'>> = (props) => {
  const [local, rest] = splitProps(props, ['class'])

  return <h3 class={clx('text-muted-foreground text-sm', local.class)} {...rest} />
}

export const CardContent = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class'])

  return <div class={clx('p-6 pt-0', local.class)} {...rest} />
}

export const CardFooter = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class'])

  return <div class={clx('flex items-center p-6 pt-0', local.class)} {...rest} />
}
