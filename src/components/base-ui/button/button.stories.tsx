import { fn } from '@storybook/test'
import * as Lucide from 'lucide-solid'
import { For } from 'solid-js'
import type { Meta, StoryObj } from 'storybook-solidjs'
import { Button, type ButtonProps } from './button'
import { type ButtonVariants } from './button.css'

const variantOptions: NonNullable<ButtonVariants['variant']>[] = [
  'default',
  'primary',
  'secondary',
  'destructive',
  'outline',
  'ghost',
  'link',
]

const sizeOptions: NonNullable<ButtonVariants['size']>[] = ['default', 'sm', 'lg', 'icon']

const meta: Meta<ButtonProps> = {
  title: 'Basic Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: variantOptions,
      description: 'Button style variant',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: { type: 'select' },
      options: sizeOptions,
      description: 'Button size',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button',
    },
    class: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    onClick: fn(),
    variant: 'default',
    size: 'default',
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const AllVariants: Story = {
  render: (args: ButtonProps) => (
    <div class="flex flex-wrap items-center gap-4">
      <For each={variantOptions}>
        {(variant) => (
          <Button {...args} variant={variant}>
            {variant}
          </Button>
        )}
      </For>
    </div>
  ),
}

export const AllSizes: Story = {
  render: (args: ButtonProps) => (
    <div class="flex flex-wrap items-end gap-4">
      <For each={sizeOptions}>
        {(size) => (
          <Button {...args} size={size}>
            {size === 'icon' ? <Lucide.Plus /> : size}
          </Button>
        )}
      </For>
    </div>
  ),
}

export const WithIcons: Story = {
  render: (args: ButtonProps) => (
    <div class="flex flex-wrap items-center gap-4">
      <Button {...args}>
        <Lucide.Search class="mr-2 h-4 w-4" />
        Search
      </Button>
      <Button {...args} variant="outline">
        <Lucide.Github class="mr-2 h-4 w-4" />
        Github
      </Button>
      <Button {...args} size="icon">
        <Lucide.Bell class="h-4 w-4" />
      </Button>
    </div>
  ),
}

export const States: Story = {
  render: (args: ButtonProps) => (
    <div class="flex flex-wrap items-center gap-4">
      <Button {...args} disabled>
        Disabled
      </Button>
      <Button {...args} variant="outline" disabled>
        Disabled Outline
      </Button>
    </div>
  ),
}
