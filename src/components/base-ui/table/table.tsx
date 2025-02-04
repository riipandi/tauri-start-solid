import { type ComponentProps, splitProps } from 'solid-js'
import { clx } from '#/libs/utils'

export const Table = (props: ComponentProps<'table'>) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <div class="w-full overflow-auto">
      <table class={clx('w-full caption-bottom text-sm', local.class)} {...rest} />
    </div>
  )
}

export const TableHeader = (props: ComponentProps<'thead'>) => {
  const [local, rest] = splitProps(props, ['class'])

  return <thead class={clx('[&_tr]:border-b', local.class)} {...rest} />
}

export const TableBody = (props: ComponentProps<'tbody'>) => {
  const [local, rest] = splitProps(props, ['class'])

  return <tbody class={clx('[&_tr:last-child]:border-0', local.class)} {...rest} />
}

export const TableFooter = (props: ComponentProps<'tfoot'>) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <tbody class={clx('bg-primary font-medium text-primary-foreground', local.class)} {...rest} />
  )
}

export const TableRow = (props: ComponentProps<'tr'>) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <tr
      class={clx(
        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        local.class
      )}
      {...rest}
    />
  )
}

export const TableHead = (props: ComponentProps<'th'>) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <th
      class={clx(
        'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        local.class
      )}
      {...rest}
    />
  )
}

export const TableCell = (props: ComponentProps<'td'>) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <td
      class={clx(
        'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        local.class
      )}
      {...rest}
    />
  )
}

export const TableCaption = (props: ComponentProps<'caption'>) => {
  const [local, rest] = splitProps(props, ['class'])

  return <caption class={clx('mt-4 text-muted-foreground text-sm', local.class)} {...rest} />
}
