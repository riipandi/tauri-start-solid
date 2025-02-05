import { render } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '#/components/base-ui'

const actor = userEvent.setup()

describe('Button', () => {
  // Test rendering of the button component
  it('renders correctly', () => {
    const { getByRole } = render(() => <Button />)
    expect(getByRole('button')).toBeDefined()
  })

  // Test handling of click events
  it('handles click events', async () => {
    const handleClick = vi.fn()
    const { getByRole } = render(() => <Button onClick={handleClick}>Click me</Button>)
    const button = getByRole('button')
    await actor.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  // Test disabled state
  it('renders disabled state correctly', () => {
    const handleClick = vi.fn()
    const { getAllByText } = render(() => (
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    ))
    const [button] = getAllByText('Disabled Button')
    expect(button.closest('button')).toHaveAttribute('disabled')
    button.click()
    expect(handleClick).not.toHaveBeenCalled()
  })

  // Test custom className
  it('accepts and applies custom className', () => {
    const customClass = 'my-custom-class'
    const { getAllByText } = render(() => <Button class={customClass}>Custom Button</Button>)
    const [button] = getAllByText('Custom Button')
    expect(button.className).toContain(customClass)
  })
})
