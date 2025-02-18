import { A } from '@solidjs/router'
import { JSX, Show, splitProps } from 'solid-js'

const LINK_PREFIXES = ['/', 'http', 'mailto', '#', 'tel']

interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: any
}

export function Link(props: LinkProps) {
  const [local, rest] = splitProps(props, ['href', 'children'])
  const storyName = decodeURIComponent(local.href || '')
  const isStoryName = !LINK_PREFIXES.some((prefix) => storyName.startsWith(prefix))

  return (
    <Show
      when={isStoryName}
      fallback={
        <a href={local.href} {...rest}>
          {local.children}
        </a>
      }
    >
      <A href={storyName} {...rest}>
        {local.children}
      </A>
    </Show>
  )
}
