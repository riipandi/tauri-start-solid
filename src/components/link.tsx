import { A } from '@solidjs/router'
import type { ComponentProps, ParentComponent } from 'solid-js'
import { splitProps } from 'solid-js'
import { clx } from '#/libs/utils'

interface CustomLinkProps extends Omit<ComponentProps<'a'>, 'href'> {
  href: string
  newTab?: boolean
}

/**
 * Custom Link component that wraps SolidJS Router's A component.
 * This component provides consistent styling and behavior for links.
 *
 * @returns A SolidJS element that renders a link.
 *
 * Example usage:
 * ```tsx
 * <Link href="/path" class="custom-class">Link Text</Link>
 * ```
 */
const Link: ParentComponent<CustomLinkProps> = (props) => {
  const [local, rest] = splitProps(props, ['href', 'class', 'newTab'])

  return (
    <A
      href={local.href}
      class={clx('text-inherit dark:text-inherit', local.class)}
      rel={local.newTab ? 'noopener noreferrer' : undefined}
      target={local.newTab ? '_blank' : undefined}
      {...rest}
    />
  )
}

export { Link }
